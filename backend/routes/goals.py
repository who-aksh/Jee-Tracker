from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from typing import List, Optional
from datetime import datetime, date, timedelta
from models.goal import Goal, GoalCreate, GoalUpdate, CalendarEvent, CalendarEventCreate
from auth import get_current_user_id
from database import get_collection

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/", response_model=List[Goal])
async def get_user_goals(
    category: Optional[str] = Query(None, description="Filter by category"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get user's goals."""
    collection = get_collection("goals")
    
    filters = {"userId": ObjectId(current_user_id)}
    if category:
        filters["category"] = category
    if priority:
        filters["priority"] = priority
    if completed is not None:
        filters["completed"] = completed
    
    cursor = collection.find(filters).sort("deadline", 1)
    goals = await cursor.to_list(length=None)
    
    result = []
    for goal in goals:
        result.append(Goal(
            id=str(goal["_id"]),
            userId=str(goal["userId"]),
            title=goal["title"],
            description=goal["description"],
            deadline=goal["deadline"],
            progress=goal.get("progress", 0),
            priority=goal.get("priority", "medium"),
            category=goal["category"],
            completed=goal.get("completed", False),
            createdAt=goal["createdAt"],
            updatedAt=goal.get("updatedAt", goal["createdAt"])
        ))
    
    return result

@router.post("/", response_model=Goal)
async def create_goal(
    goal_data: GoalCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Create new goal."""
    collection = get_collection("goals")
    users_collection = get_collection("users")
    
    goal = Goal(
        userId=ObjectId(current_user_id),
        title=goal_data.title,
        description=goal_data.description,
        deadline=goal_data.deadline,
        priority=goal_data.priority,
        category=goal_data.category
    )
    
    result = await collection.insert_one(goal.dict(by_alias=True))
    goal.id = str(result.inserted_id)
    
    # Award XP for setting goal
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    new_total_xp = user.get("totalXP", 0) + 15  # 15 XP for creating a goal
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"totalXP": new_total_xp}}
    )
    
    return goal

@router.get("/{goal_id}", response_model=Goal)
async def get_goal(
    goal_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get specific goal."""
    collection = get_collection("goals")
    
    goal = await collection.find_one({
        "_id": ObjectId(goal_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    return Goal(
        id=str(goal["_id"]),
        userId=str(goal["userId"]),
        title=goal["title"],
        description=goal["description"],
        deadline=goal["deadline"],
        progress=goal.get("progress", 0),
        priority=goal.get("priority", "medium"),
        category=goal["category"],
        completed=goal.get("completed", False),
        createdAt=goal["createdAt"],
        updatedAt=goal.get("updatedAt", goal["createdAt"])
    )

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: str,
    update_data: GoalUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update goal."""
    collection = get_collection("goals")
    users_collection = get_collection("users")
    
    # Verify goal belongs to user
    goal = await collection.find_one({
        "_id": ObjectId(goal_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    update_dict = {"updatedAt": datetime.utcnow()}
    
    if update_data.title:
        update_dict["title"] = update_data.title
    if update_data.description:
        update_dict["description"] = update_data.description
    if update_data.deadline:
        update_dict["deadline"] = update_data.deadline
    if update_data.progress is not None:
        update_dict["progress"] = min(max(update_data.progress, 0), 100)  # Clamp between 0-100
        
        # Check if goal is completed (100% progress)
        if update_data.progress >= 100 and not goal.get("completed", False):
            update_dict["completed"] = True
            
            # Award XP for completing goal
            xp_reward = 50 if update_data.priority == "high" else 30 if update_data.priority == "medium" else 20
            
            user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
            new_total_xp = user.get("totalXP", 0) + xp_reward
            
            await users_collection.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$set": {"totalXP": new_total_xp}}
            )
    
    if update_data.priority:
        update_dict["priority"] = update_data.priority
    if update_data.category:
        update_dict["category"] = update_data.category
    if update_data.completed is not None:
        update_dict["completed"] = update_data.completed
    
    await collection.update_one(
        {"_id": ObjectId(goal_id)},
        {"$set": update_dict}
    )
    
    # Return updated goal
    updated_goal = await collection.find_one({"_id": ObjectId(goal_id)})
    
    return Goal(
        id=str(updated_goal["_id"]),
        userId=str(updated_goal["userId"]),
        title=updated_goal["title"],
        description=updated_goal["description"],
        deadline=updated_goal["deadline"],
        progress=updated_goal.get("progress", 0),
        priority=updated_goal.get("priority", "medium"),
        category=updated_goal["category"],
        completed=updated_goal.get("completed", False),
        createdAt=updated_goal["createdAt"],
        updatedAt=updated_goal.get("updatedAt", updated_goal["createdAt"])
    )

@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Delete goal."""
    collection = get_collection("goals")
    
    result = await collection.delete_one({
        "_id": ObjectId(goal_id),
        "userId": ObjectId(current_user_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    return {"message": "Goal deleted successfully"}

@router.get("/upcoming/deadlines")
async def get_upcoming_deadlines(
    days: int = Query(7, description="Number of days to look ahead"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get goals with upcoming deadlines."""
    collection = get_collection("goals")
    
    today = date.today()
    future_date = today + timedelta(days=days)
    
    cursor = collection.find({
        "userId": ObjectId(current_user_id),
        "deadline": {"$gte": today, "$lte": future_date},
        "completed": False
    }).sort("deadline", 1)
    
    goals = await cursor.to_list(length=None)
    
    result = []
    for goal in goals:
        days_remaining = (goal["deadline"] - today).days
        result.append({
            "id": str(goal["_id"]),
            "title": goal["title"],
            "deadline": goal["deadline"].isoformat(),
            "daysRemaining": days_remaining,
            "progress": goal.get("progress", 0),
            "priority": goal.get("priority", "medium"),
            "category": goal["category"]
        })
    
    return {"upcomingDeadlines": result, "totalCount": len(result)}

@router.get("/stats/overview")
async def get_goals_overview(current_user_id: str = Depends(get_current_user_id)):
    """Get goals statistics overview."""
    collection = get_collection("goals")
    
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    goals = await cursor.to_list(length=None)
    
    if not goals:
        return {
            "totalGoals": 0,
            "completedGoals": 0,
            "averageProgress": 0,
            "categoryDistribution": {},
            "priorityDistribution": {},
            "completionRate": 0
        }
    
    total_goals = len(goals)
    completed_goals = sum(1 for goal in goals if goal.get("completed", False))
    total_progress = sum(goal.get("progress", 0) for goal in goals)
    average_progress = total_progress / total_goals if total_goals > 0 else 0
    
    # Category distribution
    category_distribution = {}
    for goal in goals:
        category = goal["category"]
        if category not in category_distribution:
            category_distribution[category] = {"total": 0, "completed": 0}
        category_distribution[category]["total"] += 1
        if goal.get("completed", False):
            category_distribution[category]["completed"] += 1
    
    # Priority distribution
    priority_distribution = {}
    for goal in goals:
        priority = goal.get("priority", "medium")
        if priority not in priority_distribution:
            priority_distribution[priority] = {"total": 0, "completed": 0}
        priority_distribution[priority]["total"] += 1
        if goal.get("completed", False):
            priority_distribution[priority]["completed"] += 1
    
    completion_rate = (completed_goals / total_goals) * 100 if total_goals > 0 else 0
    
    return {
        "totalGoals": total_goals,
        "completedGoals": completed_goals,
        "averageProgress": round(average_progress, 1),
        "categoryDistribution": category_distribution,
        "priorityDistribution": priority_distribution,
        "completionRate": round(completion_rate, 1)
    }

# Calendar Events endpoints
@router.get("/calendar/events")
async def get_calendar_events(
    start_date: Optional[date] = Query(None, description="Start date filter"),
    end_date: Optional[date] = Query(None, description="End date filter"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get calendar events."""
    collection = get_collection("calendar_events")
    
    filters = {"userId": ObjectId(current_user_id)}
    if start_date and end_date:
        filters["date"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        filters["date"] = {"$gte": start_date}
    elif end_date:
        filters["date"] = {"$lte": end_date}
    
    cursor = collection.find(filters).sort("date", 1)
    events = await cursor.to_list(length=None)
    
    result = []
    for event in events:
        result.append(CalendarEvent(
            id=str(event["_id"]),
            userId=str(event["userId"]),
            title=event["title"],
            description=event.get("description"),
            date=event["date"],
            time=event.get("time"),
            type=event["type"],
            priority=event.get("priority", "medium"),
            completed=event.get("completed", False),
            createdAt=event["createdAt"]
        ))
    
    return result

@router.post("/calendar/events")
async def create_calendar_event(
    event_data: CalendarEventCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Create calendar event."""
    collection = get_collection("calendar_events")
    
    event = CalendarEvent(
        userId=ObjectId(current_user_id),
        title=event_data.title,
        description=event_data.description,
        date=event_data.date,
        time=event_data.time,
        type=event_data.type,
        priority=event_data.priority
    )
    
    result = await collection.insert_one(event.dict(by_alias=True))
    event.id = str(result.inserted_id)
    
    return event