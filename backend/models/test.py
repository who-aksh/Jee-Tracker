from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from bson import ObjectId
from models.user import PyObjectId

class SubjectScore(BaseModel):
    score: int
    total: int
    accuracy: float

class TestResult(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    type: str  # 'mains' or 'advanced'
    date: datetime = Field(default_factory=datetime.utcnow)
    score: int
    totalMarks: int
    accuracy: float
    timeSpent: int  # in minutes
    subjects: Dict[str, SubjectScore]
    weakTopics: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TestResultCreate(BaseModel):
    type: str
    score: int
    totalMarks: int
    timeSpent: int
    subjects: Dict[str, SubjectScore]
    weakTopics: List[str] = []

class TestAnalytics(BaseModel):
    averageScore: float
    totalTests: int
    bestScore: int
    averageTime: int
    recentTests: List[TestResult]
    weakTopics: List[Dict[str, int]]
    subjectPerformance: Dict[str, Dict[str, float]]
    trend: Dict[str, float]