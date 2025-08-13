from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from typing import List, Optional
from datetime import datetime, timedelta
from models.flashcard import Flashcard, FlashcardCreate, FlashcardUpdate, FlashcardReview, StudySession
from auth import get_current_user_id
from database import get_collection
import random

router = APIRouter(prefix="/flashcards", tags=["flashcards"])

def calculate_next_review(difficulty: str, is_correct: bool, review_count: int) -> datetime:
    """Calculate next review date using spaced repetition algorithm."""
    base_intervals = {
        "easy": [1, 3, 7, 14, 30],
        "medium": [1, 2, 5, 10, 21],
        "hard": [1, 1, 3, 7, 14]
    }
    
    intervals = base_intervals.get(difficulty, base_intervals["medium"])
    
    if not is_correct:
        # Reset to beginning if incorrect
        next_interval = 1
    else:
        # Use progressive intervals
        if review_count < len(intervals):
            next_interval = intervals[review_count]
        else:
            # For reviews beyond the base intervals, use exponential growth
            next_interval = intervals[-1] * (2 ** (review_count - len(intervals) + 1))
    
    return datetime.utcnow() + timedelta(days=next_interval)

@router.get("/", response_model=List[Flashcard])
async def get_user_flashcards(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Get user's flashcards."""
    collection = get_collection("flashcards")
    
    filters = {"userId": ObjectId(current_user_id)}
    if subject:
        filters["subject"] = subject
    if difficulty:
        filters["difficulty"] = difficulty
    
    cursor = collection.find(filters).sort("createdAt", -1)
    flashcards = await cursor.to_list(length=None)
    
    result = []
    for card in flashcards:
        result.append(Flashcard(
            id=str(card["_id"]),
            userId=str(card["userId"]),
            subject=card["subject"],
            topic=card["topic"],
            question=card["question"],
            answer=card["answer"],
            difficulty=card["difficulty"],
            lastReviewed=card.get("lastReviewed"),
            nextReview=card["nextReview"],
            reviewCount=card.get("reviewCount", 0),
            correctCount=card.get("correctCount", 0),
            createdAt=card["createdAt"]
        ))
    
    return result

@router.post("/", response_model=Flashcard)
async def create_flashcard(
    card_data: FlashcardCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Create new flashcard."""
    collection = get_collection("flashcards")
    users_collection = get_collection("users")
    
    flashcard = Flashcard(
        userId=ObjectId(current_user_id),
        subject=card_data.subject,
        topic=card_data.topic,
        question=card_data.question,
        answer=card_data.answer,
        difficulty=card_data.difficulty
    )
    
    result = await collection.insert_one(flashcard.dict(by_alias=True))
    flashcard.id = str(result.inserted_id)
    
    # Award XP for creating flashcard
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    new_total_xp = user.get("totalXP", 0) + 5  # 5 XP for creating a flashcard
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"totalXP": new_total_xp}}
    )
    
    return flashcard

@router.get("/{card_id}", response_model=Flashcard)
async def get_flashcard(
    card_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get specific flashcard."""
    collection = get_collection("flashcards")
    
    card = await collection.find_one({
        "_id": ObjectId(card_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    return Flashcard(
        id=str(card["_id"]),
        userId=str(card["userId"]),
        subject=card["subject"],
        topic=card["topic"],
        question=card["question"],
        answer=card["answer"],
        difficulty=card["difficulty"],
        lastReviewed=card.get("lastReviewed"),
        nextReview=card["nextReview"],
        reviewCount=card.get("reviewCount", 0),
        correctCount=card.get("correctCount", 0),
        createdAt=card["createdAt"]
    )

@router.put("/{card_id}", response_model=Flashcard)
async def update_flashcard(
    card_id: str,
    update_data: FlashcardUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update flashcard."""
    collection = get_collection("flashcards")
    
    # Verify card belongs to user
    card = await collection.find_one({
        "_id": ObjectId(card_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    update_dict = {}
    if update_data.subject:
        update_dict["subject"] = update_data.subject
    if update_data.topic:
        update_dict["topic"] = update_data.topic
    if update_data.question:
        update_dict["question"] = update_data.question
    if update_data.answer:
        update_dict["answer"] = update_data.answer
    if update_data.difficulty:
        update_dict["difficulty"] = update_data.difficulty
    
    if update_dict:
        await collection.update_one(
            {"_id": ObjectId(card_id)},
            {"$set": update_dict}
        )
    
    # Return updated card
    updated_card = await collection.find_one({"_id": ObjectId(card_id)})
    
    return Flashcard(
        id=str(updated_card["_id"]),
        userId=str(updated_card["userId"]),
        subject=updated_card["subject"],
        topic=updated_card["topic"],
        question=updated_card["question"],
        answer=updated_card["answer"],
        difficulty=updated_card["difficulty"],
        lastReviewed=updated_card.get("lastReviewed"),
        nextReview=updated_card["nextReview"],
        reviewCount=updated_card.get("reviewCount", 0),
        correctCount=updated_card.get("correctCount", 0),
        createdAt=updated_card["createdAt"]
    )

@router.delete("/{card_id}")
async def delete_flashcard(
    card_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Delete flashcard."""
    collection = get_collection("flashcards")
    
    result = await collection.delete_one({
        "_id": ObjectId(card_id),
        "userId": ObjectId(current_user_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    return {"message": "Flashcard deleted successfully"}

@router.get("/due/review")
async def get_cards_due_for_review(current_user_id: str = Depends(get_current_user_id)):
    """Get flashcards due for review."""
    collection = get_collection("flashcards")
    
    now = datetime.utcnow()
    cursor = collection.find({
        "userId": ObjectId(current_user_id),
        "nextReview": {"$lte": now}
    }).sort("nextReview", 1)
    
    cards = await cursor.to_list(length=None)
    
    result = []
    for card in cards:
        result.append(Flashcard(
            id=str(card["_id"]),
            userId=str(card["userId"]),
            subject=card["subject"],
            topic=card["topic"],
            question=card["question"],
            answer=card["answer"],
            difficulty=card["difficulty"],
            lastReviewed=card.get("lastReviewed"),
            nextReview=card["nextReview"],
            reviewCount=card.get("reviewCount", 0),
            correctCount=card.get("correctCount", 0),
            createdAt=card["createdAt"]
        ))
    
    return {"totalDue": len(result), "cards": result}

@router.put("/{card_id}/review")
async def review_flashcard(
    card_id: str,
    review_data: FlashcardReview,
    current_user_id: str = Depends(get_current_user_id)
):
    """Record flashcard review result."""
    collection = get_collection("flashcards")
    users_collection = get_collection("users")
    
    # Get flashcard
    card = await collection.find_one({
        "_id": ObjectId(card_id),
        "userId": ObjectId(current_user_id)
    })
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    # Update review statistics
    review_count = card.get("reviewCount", 0) + 1
    correct_count = card.get("correctCount", 0)
    
    if review_data.isCorrect:
        correct_count += 1
    
    # Calculate next review date
    next_review = calculate_next_review(
        card["difficulty"], 
        review_data.isCorrect, 
        review_count
    )
    
    # Update flashcard
    await collection.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": {
            "lastReviewed": datetime.utcnow(),
            "nextReview": next_review,
            "reviewCount": review_count,
            "correctCount": correct_count
        }}
    )
    
    # Award XP for review
    xp_reward = 3 if review_data.isCorrect else 1
    
    user = await users_collection.find_one({"_id": ObjectId(current_user_id)})
    new_total_xp = user.get("totalXP", 0) + xp_reward
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"totalXP": new_total_xp}}
    )
    
    return {
        "message": "Review recorded successfully",
        "isCorrect": review_data.isCorrect,
        "nextReview": next_review.isoformat(),
        "xpAwarded": xp_reward,
        "accuracy": round((correct_count / review_count) * 100, 1) if review_count > 0 else 0
    }

@router.get("/stats/summary")
async def get_flashcard_stats(current_user_id: str = Depends(get_current_user_id)):
    """Get flashcard statistics summary."""
    collection = get_collection("flashcards")
    
    cursor = collection.find({"userId": ObjectId(current_user_id)})
    cards = await cursor.to_list(length=None)
    
    if not cards:
        return {
            "totalCards": 0,
            "cardsDue": 0,
            "averageAccuracy": 0,
            "totalReviews": 0,
            "subjectDistribution": {},
            "difficultyDistribution": {}
        }
    
    total_cards = len(cards)
    
    # Cards due for review
    now = datetime.utcnow()
    cards_due = sum(1 for card in cards if card["nextReview"] <= now)
    
    # Calculate average accuracy
    total_reviews = sum(card.get("reviewCount", 0) for card in cards)
    total_correct = sum(card.get("correctCount", 0) for card in cards)
    average_accuracy = (total_correct / total_reviews) * 100 if total_reviews > 0 else 0
    
    # Subject distribution
    subject_distribution = {}
    for card in cards:
        subject = card["subject"]
        if subject not in subject_distribution:
            subject_distribution[subject] = 0
        subject_distribution[subject] += 1
    
    # Difficulty distribution
    difficulty_distribution = {}
    for card in cards:
        difficulty = card["difficulty"]
        if difficulty not in difficulty_distribution:
            difficulty_distribution[difficulty] = 0
        difficulty_distribution[difficulty] += 1
    
    return {
        "totalCards": total_cards,
        "cardsDue": cards_due,
        "averageAccuracy": round(average_accuracy, 1),
        "totalReviews": total_reviews,
        "subjectDistribution": subject_distribution,
        "difficultyDistribution": difficulty_distribution
    }

@router.post("/session/start")
async def start_study_session(
    subject: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    card_count: int = Query(10, description="Number of cards for session"),
    current_user_id: str = Depends(get_current_user_id)
):
    """Start a focused study session."""
    collection = get_collection("flashcards")
    
    filters = {"userId": ObjectId(current_user_id)}
    if subject:
        filters["subject"] = subject
    if difficulty:
        filters["difficulty"] = difficulty
    
    # Get cards due for review first, then random cards
    now = datetime.utcnow()
    due_cursor = collection.find({**filters, "nextReview": {"$lte": now}}).limit(card_count)
    due_cards = await due_cursor.to_list(length=None)
    
    remaining_count = card_count - len(due_cards)
    if remaining_count > 0:
        # Get random cards that are not due
        random_cursor = collection.find({**filters, "nextReview": {"$gt": now}}).limit(remaining_count)
        random_cards = await random_cursor.to_list(length=None)
        all_cards = due_cards + random_cards
    else:
        all_cards = due_cards[:card_count]
    
    # Shuffle the cards
    random.shuffle(all_cards)
    
    # Convert to response format
    session_cards = []
    for card in all_cards:
        session_cards.append({
            "id": str(card["_id"]),
            "subject": card["subject"],
            "topic": card["topic"],
            "question": card["question"],
            "answer": card["answer"],
            "difficulty": card["difficulty"]
        })
    
    return {
        "sessionId": str(ObjectId()),  # Generate session ID
        "totalCards": len(session_cards),
        "dueCards": len(due_cards),
        "cards": session_cards
    }