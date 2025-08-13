from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from typing import List, Optional
from datetime import datetime, date
from models.timetable import TimetableEntry, TimetableEntryCreate, TimetableEntryUpdate, WeeklyProgress
from auth import get_current_user_id
from database import get_collection

router = APIRouter(prefix="/timetable", tags=["timetable"])

@router.get("/", response_model=List[TimetableEntry])
async def get_user_timetable(
    day: Optional[str] = Query(None, description="Filter by day of week"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get user's timetable."""
    collection = get_collection("timetable")
    
    filters = {"userId": ObjectId(current_user_id)}
    if day:
        filters["day"] = day.lower()
    
    cursor = collection.find(filters).sort("day", 1).sort("time", 1)
    entries = await cursor.to_list(length=None)
    
    result = []
    for entry in entries:
        result.append(TimetableEntry(
            id=str(entry["_id"]),
            userId=str(entry["userId"]),
            day=entry["day"],
            time=entry["time"],
            subject=entry["subject"],
            topic=entry["topic"],
            completed=entry.get("completed", False),
            createdAt=entry["createdAt"]
        ))
    
    return result

@router.post("/", response_model=TimetableEntry)
async def create_timetable_entry(
    entry_data: TimetableEntryCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Create new timetable entry."""
    collection = get_collection("timetable")
    
    entry = TimetableEntry(
        userId=ObjectId(current_user_id),
        day=entry_data.day.lower(),
        time=entry_data.time,
        subject=entry_data.subject,
        topic=entry_data.topic
    )
    
    result = await collection.insert_one(entry.dict(by_alias=True))
    entry.id = str(result.inserted_id)
    
    return entry

@router.put("/{entry_id}", response_model=TimetableEntry)
async def update_timetable_entry(
    entry_id: str,
    update_data: TimetableEntryUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update timetable entry."""
    collection = get_collection("timetable")
    users_collection = get_collection("users")
    
    # Verify entry belongs to user
    entry = await collection.find_one({
        "_id": ObjectId(entry_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable entry not found"
        )
    
    update_dict = {}
    if update_data.day:
        update_dict["day"] = update_data.day.lower()
    if update_data.time:
        update_dict["time"] = update_data.time
    if update_data.subject:
        update_dict["subject"] = update_data.subject
    if update_data.topic:
        update_dict["topic"] = update_data.topic
    if update_data.completed is not None:
        update_dict["completed"] = update_data.completed
    
    if update_dict:
        await collection.update_one(
            {"_id": ObjectId(entry_id)},
            {"$set": update_dict}
        )
        
        # Award XP for task completion
        if update_data.completed and not entry.get("completed", False):
            user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
            new_total_xp = user.get("totalXP", 0) + 10  # 10 XP for completing a task
            
            await users_collection.update_one(
                {"_id": ObjectId(current_user_id)},
                {"$set": {"totalXP": new_total_xp}}
            )
    
    # Return updated entry
    updated_entry = await collection.find_one({"_id": ObjectId(entry_id)})
    
    return TimetableEntry(
        id=str(updated_entry["_id"]),
        userId=str(updated_entry["userId"]),
        day=updated_entry["day"],
        time=updated_entry["time"],
        subject=updated_entry["subject"],
        topic=updated_entry["topic"],
        completed=updated_entry.get("completed", False),
        createdAt=updated_entry["createdAt"]
    )

@router.delete("/{entry_id}")
async def delete_timetable_entry(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Delete timetable entry."""
    collection = get_collection("timetable")
    
    # Verify entry belongs to user and delete
    result = await collection.delete_one({
        "_id": ObjectId(entry_id),
        "userId": ObjectId(current_user_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable entry not found"
        )
    
    return {"message": "Timetable entry deleted successfully"}

@router.put("/{entry_id}/complete")
async def mark_task_complete(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Mark task as complete."""
    return await update_timetable_entry(
        entry_id,
        TimetableEntryUpdate(completed=True),
        current_user_id
    )

@router.get("/today")
async def get_todays_tasks(current_user_id: str = Depends(get_current_user_id)):
    """Get today's tasks."""
    today = datetime.now().strftime("%A").lower()
    return await get_user_timetable(day=today, current_user_id=current_user_id)

@router.get("/progress/weekly", response_model=WeeklyProgress)
async def get_weekly_progress(current_user_id: str = Depends(get_current_user_id)):
    """Get weekly progress statistics."""
    collection = get_collection("timetable")
    
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    entries = await cursor.to_list(length=None)
    
    total_tasks = len(entries)
    completed_tasks = sum(1 for entry in entries if entry.get("completed", False))
    
    # Day-wise progress
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    day_progress = {}
    
    for day in days:
        day_tasks = [entry for entry in entries if entry["day"] == day]
        day_completed = sum(1 for entry in day_tasks if entry.get("completed", False))
        
        if day_tasks:
            day_progress[day] = round((day_completed / len(day_tasks)) * 100, 1)
        else:
            day_progress[day] = 0
    
    overall_progress = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    
    return WeeklyProgress(
        totalTasks=total_tasks,
        completedTasks=completed_tasks,
        progressPercentage=round(overall_progress, 1),
        dayProgress=day_progress
    )

@router.get("/stats")
async def get_timetable_stats(current_user_id: str = Depends(get_current_user_id)):
    """Get detailed timetable statistics."""
    collection = get_collection("timetable")
    
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    entries = await cursor.to_list(length=None)
    
    # Subject distribution
    subject_stats = {}
    for entry in entries:
        subject = entry["subject"]
        if subject not in subject_stats:
            subject_stats[subject] = {"total": 0, "completed": 0}
        
        subject_stats[subject]["total"] += 1
        if entry.get("completed", False):
            subject_stats[subject]["completed"] += 1
    
    # Add completion percentage for each subject
    for subject in subject_stats:
        stats = subject_stats[subject]
        stats["completionRate"] = round((stats["completed"] / stats["total"]) * 100, 1) if stats["total"] > 0 else 0
    
    # Time slot analysis
    time_slots = {}
    for entry in entries:
        time = entry["time"]
        if time not in time_slots:
            time_slots[time] = {"total": 0, "completed": 0}
        
        time_slots[time]["total"] += 1
        if entry.get("completed", False):
            time_slots[time]["completed"] += 1
    
    return {
        "totalEntries": len(entries),
        "completedEntries": sum(1 for entry in entries if entry.get("completed", False)),
        "subjectDistribution": subject_stats,
        "timeSlotAnalysis": time_slots,
        "completionRate": round((sum(1 for entry in entries if entry.get("completed", False)) / len(entries)) * 100, 1) if entries else 0
    }