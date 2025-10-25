from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from enum import Enum


class PollStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"


class PollBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: PollStatus = PollStatus.ACTIVE


class Poll(PollBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    options: List["Option"] = Relationship(back_populates="poll")
    votes: List["Vote"] = Relationship(back_populates="poll")
    likes: List["Like"] = Relationship(back_populates="poll")


class PollCreate(PollBase):
    pass


class PollRead(PollBase):
    id: int
    created_at: datetime
    updated_at: datetime


class OptionBase(SQLModel):
    text: str
    poll_id: int = Field(foreign_key="poll.id")


class Option(OptionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    poll: Poll = Relationship(back_populates="options")
    votes: List["Vote"] = Relationship(back_populates="option")


class OptionCreate(OptionBase):
    pass


class OptionRead(OptionBase):
    id: int
    created_at: datetime
    vote_count: int = 0


class VoteBase(SQLModel):
    poll_id: int = Field(foreign_key="poll.id")
    option_id: int = Field(foreign_key="option.id")
    user_id: str  # Simple user identifier


class Vote(VoteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    poll: Poll = Relationship(back_populates="votes")
    option: Option = Relationship(back_populates="votes")


class VoteCreate(VoteBase):
    pass


class VoteRead(VoteBase):
    id: int
    created_at: datetime


class LikeBase(SQLModel):
    poll_id: int = Field(foreign_key="poll.id")
    user_id: str  # Simple user identifier


class Like(LikeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    poll: Poll = Relationship(back_populates="likes")


class LikeCreate(LikeBase):
    pass


class LikeRead(LikeBase):
    id: int
    created_at: datetime


class PollWithDetails(PollRead):
    options: List["OptionRead"] = []
    votes: List["VoteRead"] = []
    likes: List["LikeRead"] = []
    total_votes: int = 0
    total_likes: int = 0
