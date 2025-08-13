from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from typing import List, Dict, Any
from datetime import datetime
from models.syllabus import SyllabusItem, SyllabusItemUpdate, SyllabusProgress, OverallProgress
from auth import get_current_user_id
from database import get_collection

router = APIRouter(prefix="/syllabus", tags=["syllabus"])

@router.get("/", response_model=Dict[str, Any])
async def get_complete_syllabus(current_user_id: str = Depends(get_current_user_id)):
    """Get complete syllabus for user."""
    collection = get_collection("syllabus")
    
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    syllabus_items = await cursor.to_list(length=None)
    
    # Organize by type and subject
    organized = {"mains": {}, "advanced": {}}
    
    for item in syllabus_items:
        exam_type = item["type"]
        subject = item["subject"]
        
        if subject not in organized[exam_type]:
            organized[exam_type][subject] = []
        
        organized[exam_type][subject].append({
            "id": str(item["_id"]),
            "topic": item["topic"],
            "subtopics": item["subtopics"],
            "status": item["status"],
            "highYield": item["highYield"],
            "updatedAt": item["updatedAt"].isoformat()
        })
    
    return organized

@router.get("/{exam_type}")
async def get_syllabus_by_type(
    exam_type: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get syllabus by exam type (mains/advanced)."""
    if exam_type not in ["mains", "advanced"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exam type must be 'mains' or 'advanced'"
        )
    
    collection = get_collection("syllabus")
    
    cursor = collection.find({
        "userId": ObjectId(current_user_id),
        "type": exam_type
    })
    syllabus_items = await cursor.to_list(length=None)
    
    # Organize by subject
    organized = {}
    
    for item in syllabus_items:
        subject = item["subject"]
        
        if subject not in organized:
            organized[subject] = []
        
        organized[subject].append({
            "id": str(item["_id"]),
            "topic": item["topic"],
            "subtopics": item["subtopics"],
            "status": item["status"],
            "highYield": item["highYield"],
            "updatedAt": item["updatedAt"].isoformat()
        })
    
    return organized

@router.put("/topic/{topic_id}")
async def update_topic_status(
    topic_id: str,
    update_data: SyllabusItemUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update topic status."""
    collection = get_collection("syllabus")
    users_collection = get_collection("users")
    
    # Verify topic belongs to user
    topic = await collection.find_one({
        "_id": ObjectId(topic_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    update_dict = {}
    if update_data.status:
        update_dict["status"] = update_data.status
    if update_data.highYield is not None:
        update_dict["highYield"] = update_data.highYield
    
    update_dict["updatedAt"] = datetime.utcnow()
    
    await collection.update_one(
        {"_id": ObjectId(topic_id)},
        {"$set": update_dict}
    )
    
    # Award XP for topic completion
    if update_data.status == "mastered" and topic["status"] != "mastered":
        xp_reward = 25 if update_data.highYield else 15
        
        # Add XP to user
        user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
        new_total_xp = user.get("totalXP", 0) + xp_reward
        
        await users_collection.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"totalXP": new_total_xp}}
        )
        
        return {
            "message": "Topic updated successfully",
            "xpAwarded": xp_reward,
            "newTotalXP": new_total_xp
        }
    
    return {"message": "Topic updated successfully"}

@router.get("/progress/overall", response_model=OverallProgress)
async def get_overall_progress(current_user_id: str = Depends(get_current_user_id)):
    """Get overall syllabus progress."""
    collection = get_collection("syllabus")
    
    # Get all topics for user
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    all_topics = await cursor.to_list(length=None)
    
    total_topics = len(all_topics)
    completed_topics = sum(1 for topic in all_topics if topic["status"] == "mastered")
    
    # Calculate subject-wise progress
    subject_progress = {}
    for topic in all_topics:
        subject = topic["subject"]
        if subject not in subject_progress:
            subject_progress[subject] = {
                "total": 0,
                "completed": 0,
                "inProgress": 0,
                "mastered": 0,
                "weak": 0,
                "highYield": 0
            }
        
        subject_progress[subject]["total"] += 1
        
        if topic["status"] == "mastered":
            subject_progress[subject]["completed"] += 1
            subject_progress[subject]["mastered"] += 1
        elif topic["status"] == "in-progress":
            subject_progress[subject]["inProgress"] += 1
        elif topic["status"] == "weak":
            subject_progress[subject]["weak"] += 1
        
        if topic.get("highYield", False):
            subject_progress[subject]["highYield"] += 1
    
    subject_progress_list = []
    for subject, stats in subject_progress.items():
        progress_percentage = (stats["completed"] / stats["total"]) * 100 if stats["total"] > 0 else 0
        
        subject_progress_list.append(SyllabusProgress(
            subject=subject,
            totalTopics=stats["total"],
            completedTopics=stats["completed"],
            inProgressTopics=stats["inProgress"],
            masteredTopics=stats["mastered"],
            weakTopics=stats["weak"],
            highYieldTopics=stats["highYield"],
            progressPercentage=round(progress_percentage, 1)
        ))
    
    overall_percentage = (completed_topics / total_topics) * 100 if total_topics > 0 else 0
    
    return OverallProgress(
        totalTopics=total_topics,
        completedTopics=completed_topics,
        progressPercentage=round(overall_percentage, 1),
        subjectProgress=subject_progress_list
    )

@router.get("/progress/subject/{subject}")
async def get_subject_progress(
    subject: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get progress for specific subject."""
    collection = get_collection("syllabus")
    
    cursor = collection.find({
        "userId": ObjectId(current_user_id),
        "subject": subject
    })
    topics = await cursor.to_list(length=None)
    
    if not topics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No topics found for subject: {subject}"
        )
    
    total = len(topics)
    completed = sum(1 for topic in topics if topic["status"] == "mastered")
    in_progress = sum(1 for topic in topics if topic["status"] == "in-progress")
    weak = sum(1 for topic in topics if topic["status"] == "weak")
    high_yield = sum(1 for topic in topics if topic.get("highYield", False))
    
    progress_percentage = (completed / total) * 100 if total > 0 else 0
    
    return {
        "subject": subject,
        "totalTopics": total,
        "completedTopics": completed,
        "inProgressTopics": in_progress,
        "weakTopics": weak,
        "highYieldTopics": high_yield,
        "progressPercentage": round(progress_percentage, 1)
    }

@router.get("/search")
async def search_syllabus(
    query: str,
    subject: str = None,
    status: str = None,
    high_yield: bool = None,
    current_user_id: str = Depends(get_current_user_id)
):
    """Search syllabus topics."""
    collection = get_collection("syllabus")
    
    # Build search filters
    filters = {"userId": ObjectId(current_user_id)}
    
    if subject:
        filters["subject"] = subject
    
    if status:
        filters["status"] = status
    
    if high_yield is not None:
        filters["highYield"] = high_yield
    
    # Text search in topic and subtopics
    cursor = collection.find(filters)
    topics = await cursor.to_list(length=None)
    
    # Filter by query string
    filtered_topics = []
    for topic in topics:
        if (query.lower() in topic["topic"].lower() or 
            any(query.lower() in subtopic.lower() for subtopic in topic.get("subtopics", []))):
            
            filtered_topics.append({
                "id": str(topic["_id"]),
                "type": topic["type"],
                "subject": topic["subject"],
                "topic": topic["topic"],
                "subtopics": topic["subtopics"],
                "status": topic["status"],
                "highYield": topic["highYield"],
                "updatedAt": topic["updatedAt"].isoformat()
            })
    
    return {
        "query": query,
        "totalResults": len(filtered_topics),
        "results": filtered_topics
    }