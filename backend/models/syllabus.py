from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from models.user import PyObjectId

class SyllabusItem(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    type: str  # 'mains' or 'advanced'
    subject: str  # 'physics', 'chemistry', 'mathematics'
    topic: str
    subtopics: List[str] = []
    status: str = 'not-started'  # 'mastered', 'in-progress', 'weak', 'revise-soon', 'not-started'
    highYield: bool = False
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SyllabusItemCreate(BaseModel):
    type: str
    subject: str
    topic: str
    subtopics: List[str] = []
    highYield: bool = False

class SyllabusItemUpdate(BaseModel):
    status: Optional[str] = None
    highYield: Optional[bool] = None

class SyllabusProgress(BaseModel):
    subject: str
    totalTopics: int
    completedTopics: int
    inProgressTopics: int
    masteredTopics: int
    weakTopics: int
    highYieldTopics: int
    progressPercentage: float

class OverallProgress(BaseModel):
    totalTopics: int
    completedTopics: int
    progressPercentage: float
    subjectProgress: List[SyllabusProgress]