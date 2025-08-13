from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from bson import ObjectId
from models.user import User, UserCreate, UserLogin, UserResponse
from auth import get_password_hash, verify_password, create_access_token, get_current_user_id
from database import get_collection, INITIAL_SYLLABUS
from models.syllabus import SyllabusItem

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user."""
    users_collection = get_collection("users")
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name
    )
    
    # Insert user into database
    result = await users_collection.insert_one(user.dict(by_alias=True))
    user_id = result.inserted_id
    
    # Initialize syllabus for new user
    syllabus_collection = get_collection("syllabus")
    syllabus_items = []
    
    for exam_type, subjects in INITIAL_SYLLABUS.items():
        for subject, topics in subjects.items():
            for topic_data in topics:
                syllabus_item = SyllabusItem(
                    userId=user_id,
                    type=exam_type,
                    subject=subject,
                    topic=topic_data["topic"],
                    subtopics=topic_data["subtopics"],
                    highYield=topic_data["highYield"]
                )
                syllabus_items.append(syllabus_item.dict(by_alias=True))
    
    if syllabus_items:
        await syllabus_collection.insert_many(syllabus_items)
    
    # Create access token
    access_token_expires = timedelta(minutes=30 * 24 * 60)  # 30 days
    access_token = create_access_token(
        data={"sub": str(user_id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user_id),
            email=user.email,
            name=user.name,
            totalXP=user.totalXP,
            currentStreak=user.currentStreak,
            longestStreak=user.longestStreak,
            totalStudyHours=user.totalStudyHours,
            level=user.level,
            badges=user.badges
        )
    }

@router.post("/login", response_model=dict)
async def login(user_data: UserLogin):
    """Login user."""
    users_collection = get_collection("users")
    
    # Find user by email
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Update last active date
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"lastActiveDate": user.get("lastActiveDate", user["createdAt"])}}
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=30 * 24 * 60)  # 30 days
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            totalXP=user.get("totalXP", 0),
            currentStreak=user.get("currentStreak", 0),
            longestStreak=user.get("longestStreak", 0),
            totalStudyHours=user.get("totalStudyHours", 0),
            level=user.get("level", 1),
            badges=user.get("badges", [])
        )
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user_id: str = Depends(get_current_user_id)):
    """Get current user profile."""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        totalXP=user.get("totalXP", 0),
        currentStreak=user.get("currentStreak", 0),
        longestStreak=user.get("longestStreak", 0),
        totalStudyHours=user.get("totalStudyHours", 0),
        level=user.get("level", 1),
        badges=user.get("badges", [])
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    name: str = None,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update user profile."""
    users_collection = get_collection("users")
    
    update_data = {}
    if name:
        update_data["name"] = name
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_data}
    )
    
    # Return updated user
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        totalXP=user.get("totalXP", 0),
        currentStreak=user.get("currentStreak", 0),
        longestStreak=user.get("longestStreak", 0),
        totalStudyHours=user.get("totalStudyHours", 0),
        level=user.get("level", 1),
        badges=user.get("badges", [])
    )