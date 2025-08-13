from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from models.user import PyObjectId

class TimetableEntry(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    day: str  # 'monday', 'tuesday', etc.
    time: str  # '6:00-8:00'
    subject: str
    topic: str
    completed: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TimetableEntryCreate(BaseModel):
    day: str
    time: str
    subject: str
    topic: str

class TimetableEntryUpdate(BaseModel):
    day: Optional[str] = None
    time: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    completed: Optional[bool] = None

class WeeklyProgress(BaseModel):
    totalTasks: int
    completedTasks: int
    progressPercentage: float
    dayProgress: dict  # day -> progress percentage