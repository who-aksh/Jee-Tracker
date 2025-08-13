from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from models.test import TestResult, TestResultCreate, TestAnalytics, SubjectScore
from auth import get_current_user_id
from database import get_collection

router = APIRouter(prefix="/tests", tags=["tests"])

@router.get("/", response_model=List[TestResult])
async def get_user_tests(
    test_type: Optional[str] = Query(None, description="Filter by test type (mains/advanced)"),
    limit: int = Query(10, description="Number of tests to return"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get user's test history."""
    collection = get_collection("tests")
    
    filters = {"userId": ObjectId(current_user_id)}
    if test_type:
        filters["type"] = test_type
    
    cursor = collection.find(filters).sort("date", -1).limit(limit)
    tests = await cursor.to_list(length=None)
    
    result = []
    for test in tests:
        result.append(TestResult(
            id=str(test["_id"]),
            userId=str(test["userId"]),
            type=test["type"],
            date=test["date"],
            score=test["score"],
            totalMarks=test["totalMarks"],
            accuracy=test["accuracy"],
            timeSpent=test["timeSpent"],
            subjects=test["subjects"],
            weakTopics=test.get("weakTopics", []),
            createdAt=test["createdAt"]
        ))
    
    return result

@router.post("/", response_model=TestResult)
async def create_test_result(
    test_data: TestResultCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Record a new test result."""
    collection = get_collection("tests")
    users_collection = get_collection("users")
    
    # Calculate accuracy
    accuracy = (test_data.score / test_data.totalMarks) * 100
    
    test_result = TestResult(
        userId=ObjectId(current_user_id),
        type=test_data.type,
        score=test_data.score,
        totalMarks=test_data.totalMarks,
        accuracy=round(accuracy, 2),
        timeSpent=test_data.timeSpent,
        subjects=test_data.subjects,
        weakTopics=test_data.weakTopics
    )
    
    result = await collection.insert_one(test_result.dict(by_alias=True))
    
    # Award XP based on performance
    xp_reward = 0
    if accuracy >= 90:
        xp_reward = 100
    elif accuracy >= 80:
        xp_reward = 75
    elif accuracy >= 70:
        xp_reward = 50
    else:
        xp_reward = 25
    
    # Add bonus for completing test
    xp_reward += 25
    
    # Update user XP
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    new_total_xp = user.get("totalXP", 0) + xp_reward
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"totalXP": new_total_xp}}
    )
    
    # Return the created test
    test_result.id = str(result.inserted_id)
    return test_result

@router.get("/{test_id}", response_model=TestResult)
async def get_test_details(
    test_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get specific test details."""
    collection = get_collection("tests")
    
    test = await collection.find_one({
        "_id": ObjectId(test_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    return TestResult(
        id=str(test["_id"]),
        userId=str(test["userId"]),
        type=test["type"],
        date=test["date"],
        score=test["score"],
        totalMarks=test["totalMarks"],
        accuracy=test["accuracy"],
        timeSpent=test["timeSpent"],
        subjects=test["subjects"],
        weakTopics=test.get("weakTopics", []),
        createdAt=test["createdAt"]
    )

@router.get("/analytics/performance", response_model=TestAnalytics)
async def get_test_analytics(
    test_type: Optional[str] = Query(None, description="Filter by test type"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get performance analytics."""
    collection = get_collection("tests")
    
    filters = {"userId": ObjectId(current_user_id)}
    if test_type:
        filters["type"] = test_type
    
    cursor = collection.find(filters).sort("date", -1)
    tests = await cursor.to_list(length=None)
    
    if not tests:
        return TestAnalytics(
            averageScore=0,
            totalTests=0,
            bestScore=0,
            averageTime=0,
            recentTests=[],
            weakTopics=[],
            subjectPerformance={},
            trend={"score": 0, "accuracy": 0}
        )
    
    # Calculate statistics
    total_tests = len(tests)
    total_score = sum((test["score"] / test["totalMarks"]) * 100 for test in tests)
    average_score = round(total_score / total_tests, 2)
    best_score = max((test["score"] / test["totalMarks"]) * 100 for test in tests)
    average_time = sum(test["timeSpent"] for test in tests) // total_tests
    
    # Recent tests (last 5)
    recent_tests = []
    for test in tests[:5]:
        recent_tests.append(TestResult(
            id=str(test["_id"]),
            userId=str(test["userId"]),
            type=test["type"],
            date=test["date"],
            score=test["score"],
            totalMarks=test["totalMarks"],
            accuracy=test["accuracy"],
            timeSpent=test["timeSpent"],
            subjects=test["subjects"],
            weakTopics=test.get("weakTopics", []),
            createdAt=test["createdAt"]
        ))
    
    # Weak topics analysis
    weak_topics_count = {}
    for test in tests:
        for topic in test.get("weakTopics", []):
            weak_topics_count[topic] = weak_topics_count.get(topic, 0) + 1
    
    weak_topics = [{"topic": topic, "count": count} 
                   for topic, count in sorted(weak_topics_count.items(), 
                                            key=lambda x: x[1], reverse=True)]
    
    # Subject performance
    subject_performance = {}
    subjects = ["physics", "chemistry", "mathematics"]
    
    for subject in subjects:
        subject_scores = []
        for test in tests:
            if subject in test.get("subjects", {}):
                subject_scores.append(test["subjects"][subject]["accuracy"])
        
        if subject_scores:
            subject_performance[subject] = {
                "average": round(sum(subject_scores) / len(subject_scores), 2),
                "best": max(subject_scores),
                "count": len(subject_scores)
            }
    
    # Trend calculation (last 2 tests vs previous)
    trend = {"score": 0, "accuracy": 0}
    if len(tests) >= 2:
        recent_avg_score = sum((test["score"] / test["totalMarks"]) * 100 for test in tests[:2]) / 2
        previous_avg_score = sum((test["score"] / test["totalMarks"]) * 100 for test in tests[2:4]) / min(2, len(tests[2:]))
        
        trend["score"] = round(recent_avg_score - previous_avg_score, 2)
        
        recent_avg_accuracy = sum(test["accuracy"] for test in tests[:2]) / 2
        previous_avg_accuracy = sum(test["accuracy"] for test in tests[2:4]) / min(2, len(tests[2:]))
        
        trend["accuracy"] = round(recent_avg_accuracy - previous_avg_accuracy, 2)
    
    return TestAnalytics(
        averageScore=average_score,
        totalTests=total_tests,
        bestScore=round(best_score, 2),
        averageTime=average_time,
        recentTests=recent_tests,
        weakTopics=weak_topics,
        subjectPerformance=subject_performance,
        trend=trend
    )

@router.get("/analytics/weak-topics")
async def get_weak_topics_analysis(
    test_type: Optional[str] = Query(None),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get detailed weak topics analysis."""
    collection = get_collection("tests")
    
    filters = {"userId": ObjectId(current_user_id)}
    if test_type:
        filters["type"] = test_type
    
    cursor = collection.find(filters)
    tests = await cursor.to_list(length=None)
    
    weak_topics_analysis = {}
    
    for test in tests:
        for topic in test.get("weakTopics", []):
            if topic not in weak_topics_analysis:
                weak_topics_analysis[topic] = {
                    "appearances": 0,
                    "lastSeen": test["date"],
                    "testTypes": set()
                }
            
            weak_topics_analysis[topic]["appearances"] += 1
            weak_topics_analysis[topic]["testTypes"].add(test["type"])
            
            # Update last seen if this test is more recent
            if test["date"] > weak_topics_analysis[topic]["lastSeen"]:
                weak_topics_analysis[topic]["lastSeen"] = test["date"]
    
    # Convert to list and sort by appearances
    result = []
    for topic, data in weak_topics_analysis.items():
        result.append({
            "topic": topic,
            "appearances": data["appearances"],
            "lastSeen": data["lastSeen"].isoformat(),
            "testTypes": list(data["testTypes"]),
            "priority": "high" if data["appearances"] >= 3 else "medium" if data["appearances"] >= 2 else "low"
        })
    
    result.sort(key=lambda x: x["appearances"], reverse=True)
    
    return {
        "totalWeakTopics": len(result),
        "highPriority": len([t for t in result if t["priority"] == "high"]),
        "analysis": result
    }