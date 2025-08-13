from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
from bson import ObjectId
from models.user import PyObjectId

class Flashcard(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    userId: PyObjectId
    subject: str
    topic: str
    question: str
    answer: str
    difficulty: str = 'medium'  # 'easy', 'medium', 'hard'
    lastReviewed: Optional[datetime] = None
    nextReview: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=1))
    reviewCount: int = 0
    correctCount: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class FlashcardCreate(BaseModel):
    subject: str
    topic: str
    question: str
    answer: str
    difficulty: str = 'medium'

class FlashcardUpdate(BaseModel):
    subject: Optional[str] = None
    topic: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    difficulty: Optional[str] = None

class FlashcardReview(BaseModel):
    isCorrect: bool

class StudySession(BaseModel):
    totalCards: int
    correctAnswers: int
    incorrectAnswers: int
    accuracy: float
    timeSpent: int  # in minutes