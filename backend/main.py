from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import json
import redis
import asyncio
import os
from dotenv import load_dotenv

from database import get_session, create_db_and_tables
from .models import (
    Poll, PollCreate, PollRead, PollWithDetails,
    Option, OptionCreate, OptionRead,
    Vote, VoteCreate, VoteRead,
    Like, LikeCreate, LikeRead
)

load_dotenv()

app = FastAPI(title="QuickPoll API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection for real-time updates
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# WebSocket connection manager with Redis pub/sub
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.redis_pubsub = redis_client.pubsub()
        self.redis_pubsub.subscribe("poll_updates")
        self._listener_task = None

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        """Broadcast message to all connected WebSocket clients"""
        if not self.active_connections:
            return
            
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                disconnected.append(connection)
        
        # Remove broken connections
        for connection in disconnected:
            self.disconnect(connection)

    async def publish_update(self, update_data: dict):
        """Publish update to Redis channel"""
        try:
            redis_client.publish("poll_updates", json.dumps(update_data))
        except Exception as e:
            print(f"Error publishing to Redis: {e}")

    async def start_redis_listener(self):
        """Start listening to Redis pub/sub and broadcast to WebSocket clients"""
        print("Redis listener task started.")
        while True:
            try:
                message = await asyncio.to_thread(self.redis_pubsub.get_message, timeout=1.0) # Use asyncio.to_thread for blocking call
                if message:
                    print(f"Received Redis message: {message}")
                if message and message['type'] == 'message':
                    data = json.loads(message['data'])
                    print(f"Broadcasting Redis message: {data}")
                    await self.broadcast(json.dumps(data))
                await asyncio.sleep(0.01) # Small sleep to yield control
            except asyncio.CancelledError:
                print("Redis listener task cancelled.")
                break # Exit loop if task is cancelled
            except Exception as e:
                print(f"ERROR in Redis listener loop: {e}")
                import traceback
                traceback.print_exc()
                await asyncio.sleep(1) # Wait before retrying
        print("Redis listener task stopped.")

    async def start_listener(self):
        """Start the Redis listener task"""
        if self._listener_task is None:
            self._listener_task = asyncio.create_task(self.start_redis_listener())

    async def stop_listener(self):
        """Stop the Redis listener task"""
        if self._listener_task:
            self._listener_task.cancel()
            self._listener_task = None

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    """Initialize database tables and start Redis listener on startup"""
    try:
        create_db_and_tables()
        await manager.start_listener()
        print("✅ Database initialized and Redis listener started")
    except Exception as e:
        print(f"ERROR: Failed to initialize database tables: {e}")
        import traceback
        traceback.print_exc()
        # Optionally re-raise or exit if this is a critical error
        # raise e

@app.on_event("shutdown")
async def shutdown_event():
    """Stop Redis listener on shutdown"""
    await manager.stop_listener()
    print("✅ Redis listener stopped")

# Poll endpoints
@app.post("/polls/", response_model=PollRead)
async def create_poll(poll: PollCreate, session: Session = Depends(get_session)):
    """Create a new poll"""
    db_poll = Poll.model_validate(poll)
    session.add(db_poll)
    session.commit()
    session.refresh(db_poll)
    
    # Broadcast poll creation
    await manager.publish_update({
        "type": "poll_created",
        "poll": PollRead.model_validate(db_poll).dict()
    })
    
    return db_poll

@app.get("/polls/", response_model=List[PollRead])
async def list_polls(session: Session = Depends(get_session)):
    """List all polls"""
    statement = select(Poll).order_by(Poll.created_at.desc())
    polls = session.exec(statement).all()
    return polls

@app.get("/polls/{poll_id}", response_model=PollWithDetails)
async def get_poll(poll_id: int, session: Session = Depends(get_session)):
    """Get a specific poll with details"""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    # Get options with vote counts
    options = session.exec(select(Option).where(Option.poll_id == poll_id)).all()
    options_with_counts = []
    for option in options:
        vote_count = len(session.exec(select(Vote).where(Vote.option_id == option.id)).all())
        option_data = OptionRead.model_validate(option)
        option_data.vote_count = vote_count
        options_with_counts.append(option_data)
    
    # Get votes and likes
    votes = session.exec(select(Vote).where(Vote.poll_id == poll_id)).all()
    likes = session.exec(select(Like).where(Like.poll_id == poll_id)).all()
    
    poll_data = PollWithDetails.model_validate(poll)
    poll_data.options = options_with_counts
    poll_data.votes = votes
    poll_data.likes = likes
    poll_data.total_votes = len(votes)
    poll_data.total_likes = len(likes)
    
    return poll_data

# Option endpoints
@app.post("/polls/{poll_id}/options/", response_model=OptionRead)
async def add_option(poll_id: int, option: OptionCreate, session: Session = Depends(get_session)):
    """Add an option to a poll"""
    # Check if poll exists
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    db_option = Option.model_validate(option)
    db_option.poll_id = poll_id
    session.add(db_option)
    session.commit()
    session.refresh(db_option)
    
    # Broadcast update via Redis
    await manager.publish_update({
        "type": "option_added",
        "poll_id": poll_id,
        "option": OptionRead.model_validate(db_option).dict()
    })
    
    return db_option

# Vote endpoints
@app.post("/polls/{poll_id}/vote/", response_model=VoteRead)
async def vote(poll_id: int, vote: VoteCreate, session: Session = Depends(get_session)):
    """Vote on a poll"""
    # Check if poll exists
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    # Check if user already voted on this poll
    existing_vote = session.exec(
        select(Vote).where(Vote.poll_id == poll_id, Vote.user_id == vote.user_id)
    ).first()
    
    if existing_vote:
        # Update existing vote
        existing_vote.option_id = vote.option_id
        session.add(existing_vote)
        session.commit()
        session.refresh(existing_vote)
        vote_result = existing_vote
    else:
        # Create new vote
        db_vote = Vote.model_validate(vote)
        db_vote.poll_id = poll_id
        session.add(db_vote)
        session.commit()
        session.refresh(db_vote)
        vote_result = db_vote
    
    # Broadcast update via Redis
    await manager.publish_update({
        "type": "vote_cast",
        "poll_id": poll_id,
        "vote": VoteRead.model_validate(vote_result).dict()
    })
    
    return vote_result

# Like endpoints
@app.post("/polls/{poll_id}/like/", response_model=LikeRead)
async def like_poll(poll_id: int, like: LikeCreate, session: Session = Depends(get_session)):
    """Like a poll"""
    # Check if poll exists
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    # Check if user already liked this poll
    existing_like = session.exec(
        select(Like).where(Like.poll_id == poll_id, Like.user_id == like.user_id)
    ).first()
    
    if existing_like:
        # Unlike (remove like)
        session.delete(existing_like)
        session.commit()
        return {"message": "Like removed"}
    else:
        # Add like
        db_like = Like.model_validate(like)
        db_like.poll_id = poll_id
        session.add(db_like)
        session.commit()
        session.refresh(db_like)
        
        # Broadcast update via Redis
        await manager.publish_update({
            "type": "like_added",
            "poll_id": poll_id,
            "like": LikeRead.model_validate(db_like).dict()
        })
        
        return db_like

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            # Echo back (optional)
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "QuickPoll API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
