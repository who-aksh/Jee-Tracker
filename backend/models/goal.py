from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from bson import ObjectId
from models.user import PyObjectId

class Goal(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    title: str
    description: str
    deadline: date
    progress: int = 0  # 0-100
    priority: str = 'medium'  # 'high', 'medium', 'low'
    category: str  # 'syllabus', 'performance', 'routine'
    completed: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class GoalCreate(BaseModel):
    title: str
    description: str
    deadline: date
    priority: str = 'medium'
    category: str

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[date] = None
    progress: Optional[int] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

class CalendarEvent(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    title: str
    description: Optional[str] = None
    date: date
    time: Optional[str] = None
    type: str  # 'test', 'study', 'revision', 'practice', 'milestone'
    priority: str = 'medium'  # 'high', 'medium', 'low'
    completed: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: date
    time: Optional[str] = None
    type: str
    priority: str = 'medium'