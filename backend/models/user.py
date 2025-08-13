from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string')

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias='_id')
    email: EmailStr
    password: str
    name: str
    totalXP: int = 0
    currentStreak: int = 0
    longestStreak: int = 0
    totalStudyHours: int = 0
    level: int = 1
    badges: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastActiveDate: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    totalXP: int
    currentStreak: int
    longestStreak: int
    totalStudyHours: int
    level: int
    badges: List[str]

class UserStats(BaseModel):
    totalXP: int
    currentStreak: int
    longestStreak: int
    totalStudyHours: int
    completedTopics: int
    totalTopics: int
    badges: List[dict]

class UserStatsUpdate(BaseModel):
    totalXP: Optional[int] = None
    currentStreak: Optional[int] = None
    totalStudyHours: Optional[int] = None