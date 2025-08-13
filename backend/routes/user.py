from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime
from typing import List
from models.user import UserStats, UserStatsUpdate
from auth import get_current_user_id, calculate_level
from database import get_collection

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/stats", response_model=UserStats)
async def get_user_stats(current_user_id: str = Depends(get_current_user_id)):
    """Get user statistics."""
    users_collection = get_collection("users")
    syllabus_collection = get_collection("syllabus")
    
    # Get user data
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Calculate syllabus progress
    total_topics = await syllabus_collection.count_documents({"userId": ObjectId(current_user_id)})
    completed_topics = await syllabus_collection.count_documents({
        "userId": ObjectId(current_user_id),
        "status": "mastered"
    })
    
    # Get badges information
    badges = []
    for badge_name in user.get("badges", []):
        badges.append({
            "id": badge_name,
            "name": badge_name,
            "earned": True,
            "earnedDate": user.get("createdAt", datetime.utcnow()).strftime("%Y-%m-%d")
        })
    
    return UserStats(
        totalXP=user.get("totalXP", 0),
        currentStreak=user.get("currentStreak", 0),
        longestStreak=user.get("longestStreak", 0),
        totalStudyHours=user.get("totalStudyHours", 0),
        completedTopics=completed_topics,
        totalTopics=total_topics,
        badges=badges
    )

@router.put("/stats")
async def update_user_stats(
    stats_update: UserStatsUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update user statistics."""
    users_collection = get_collection("users")
    
    update_data = {}
    if stats_update.totalXP is not None:
        update_data["totalXP"] = stats_update.totalXP
        update_data["level"] = calculate_level(stats_update.totalXP)
    
    if stats_update.currentStreak is not None:
        update_data["currentStreak"] = stats_update.currentStreak
        
        # Update longest streak if current exceeds it
        user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
        if user and stats_update.currentStreak > user.get("longestStreak", 0):
            update_data["longestStreak"] = stats_update.currentStreak
    
    if stats_update.totalStudyHours is not None:
        update_data["totalStudyHours"] = stats_update.totalStudyHours
    
    if update_data:
        update_data["lastActiveDate"] = datetime.utcnow()
        await users_collection.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": update_data}
        )
    
    return {"message": "Stats updated successfully"}

@router.post("/xp")
async def add_xp(
    xp_amount: int,
    reason: str = "Study activity",
    current_user_id: str = Depends(get_current_user_id)
):
    """Add XP to user."""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    new_total_xp = user.get("totalXP", 0) + xp_amount
    new_level = calculate_level(new_total_xp)
    old_level = calculate_level(user.get("totalXP", 0))
    
    update_data = {
        "totalXP": new_total_xp,
        "level": new_level,
        "lastActiveDate": datetime.utcnow()
    }
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": update_data}
    )
    
    # Check if user leveled up
    leveled_up = new_level > old_level
    
    return {
        "message": f"Added {xp_amount} XP",
        "reason": reason,
        "newTotalXP": new_total_xp,
        "newLevel": new_level,
        "leveledUp": leveled_up
    }

@router.post("/badges/{badge_name}")
async def award_badge(
    badge_name: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Award a badge to user."""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    current_badges = user.get("badges", [])
    if badge_name not in current_badges:
        current_badges.append(badge_name)
        
        await users_collection.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"badges": current_badges}}
        )
        
        return {"message": f"Badge '{badge_name}' awarded successfully"}
    
    return {"message": f"Badge '{badge_name}' already earned"}

@router.get("/badges")
async def get_user_badges(current_user_id: str = Depends(get_current_user_id)):
    """Get user's earned badges."""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    badges = user.get("badges", [])
    return {"badges": badges}

@router.get("/level")
async def get_user_level(current_user_id: str = Depends(get_current_user_id)):
    """Get user level information."""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    total_xp = user.get("totalXP", 0)
    current_level = calculate_level(total_xp)
    xp_for_current_level = (current_level - 1) * 500
    xp_for_next_level = current_level * 500
    xp_progress_in_level = total_xp - xp_for_current_level
    xp_needed_for_next = xp_for_next_level - total_xp
    
    return {
        "currentLevel": current_level,
        "totalXP": total_xp,
        "xpForCurrentLevel": xp_for_current_level,
        "xpForNextLevel": xp_for_next_level,
        "xpProgressInLevel": xp_progress_in_level,
        "xpNeededForNext": xp_needed_for_next,
        "progressPercentage": round((xp_progress_in_level / (xp_for_next_level - xp_for_current_level)) * 100, 1)
    }