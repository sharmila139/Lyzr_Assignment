#!/usr/bin/env python3
"""
Test script to verify real-time updates work with WebSocket and Redis
"""
import asyncio
import websockets
import json
import requests
import time

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/ws"

async def test_websocket_connection():
    """Test WebSocket connection and real-time updates"""
    print("🔌 Testing WebSocket connection...")
    
    try:
        async with websockets.connect(WS_URL) as websocket:
            print("✅ WebSocket connected successfully!")
            
            # Listen for messages for 10 seconds
            print("👂 Listening for real-time updates...")
            start_time = time.time()
            
            while time.time() - start_time < 10:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    data = json.loads(message)
                    print(f"📨 Received update: {data['type']}")
                    if 'poll' in data:
                        print(f"   Poll: {data['poll']['title']}")
                    elif 'vote' in data:
                        print(f"   Vote: User {data['vote']['user_id']} voted")
                    elif 'like' in data:
                        print(f"   Like: User {data['like']['user_id']} liked")
                except asyncio.TimeoutError:
                    continue
                except Exception as e:
                    print(f"❌ Error receiving message: {e}")
                    break
            
            print("✅ WebSocket test completed!")
            
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")

def test_api_operations():
    """Test API operations that should trigger real-time updates"""
    print("\n🧪 Testing API operations...")
    
    # Create a poll
    print("1. Creating a poll...")
    poll_data = {
        "title": "Real-time Test Poll",
        "description": "Testing real-time updates"
    }
    response = requests.post(f"{BASE_URL}/polls/", json=poll_data)
    if response.status_code == 200:
        poll = response.json()
        poll_id = poll["id"]
        print(f"✅ Created poll with ID: {poll_id}")
        
        # Add options
        print("2. Adding options...")
        options = ["Option A", "Option B", "Option C"]
        for i, option_text in enumerate(options):
            option_data = {"text": option_text, "poll_id": poll_id}
            response = requests.post(f"{BASE_URL}/polls/{poll_id}/options/", json=option_data)
            print(f"   Added option {i+1}: {response.status_code}")
        
        # Vote on poll
        print("3. Voting on poll...")
        vote_data = {
            "poll_id": poll_id,
            "option_id": 1,  # First option
            "user_id": "test_user_1"
        }
        response = requests.post(f"{BASE_URL}/polls/{poll_id}/vote/", json=vote_data)
        print(f"   Vote result: {response.status_code}")
        
        # Like poll
        print("4. Liking poll...")
        like_data = {
            "poll_id": poll_id,
            "user_id": "test_user_1"
        }
        response = requests.post(f"{BASE_URL}/polls/{poll_id}/like/", json=like_data)
        print(f"   Like result: {response.status_code}")
        
        # Another vote from different user
        print("5. Another vote from different user...")
        vote_data2 = {
            "poll_id": poll_id,
            "option_id": 2,  # Second option
            "user_id": "test_user_2"
        }
        response = requests.post(f"{BASE_URL}/polls/{poll_id}/vote/", json=vote_data2)
        print(f"   Second vote result: {response.status_code}")
        
        return poll_id
    else:
        print(f"❌ Failed to create poll: {response.status_code}")
        return None

async def main():
    """Main test function"""
    print("🚀 Starting QuickPoll Real-time Test")
    print("=" * 50)

    # Start WebSocket listener concurrently
    websocket_task = asyncio.create_task(test_websocket_connection())

    # Give WebSocket a moment to connect
    print("Waiting for WebSocket to establish connection...")
    await asyncio.sleep(2) # Give it 2 seconds to connect

    # Test API operations
    print("\n🧪 Testing API operations...")
    poll_id = test_api_operations()

    if poll_id:
        print(f"\n✅ API operations completed. Poll ID: {poll_id}")
    else:
        print("\n❌ API operations failed")
        # Cancel the websocket task if API operations failed
        websocket_task.cancel()
        try:
            await websocket_task
        except asyncio.CancelledError:
            pass
        return

    # Wait for the WebSocket listener to finish its 10 seconds
    await websocket_task

    print("\n" + "=" * 50)
    print("🎉 Real-time test completed!")
    print("\nTo see real-time updates:")
    print("1. Open multiple browser tabs to http://localhost:8000/docs")
    print("2. In one tab, create polls, vote, and like")
    print("3. Watch other tabs receive real-time updates!")

if __name__ == "__main__":
    asyncio.run(main())
