# JEE Tracker Backend API Contracts

## Overview
This document outlines the API contracts, data models, and integration strategy for converting the JEE Tracker from mock data to a fully functional full-stack application.

## Current Mock Data to Replace

### 1. User Profile & Stats (`mockUserStats`)
**Data**: totalXP, currentStreak, longestStreak, totalStudyHours, completedTopics, totalTopics, badges
**Frontend Usage**: Dashboard stats, Gamification progress, Badge system

### 2. Syllabus Data (`mockSyllabusData`)  
**Data**: Complete JEE Mains + Advanced syllabus with topics, subtopics, status, highYield flags
**Frontend Usage**: Syllabus Manager, Dashboard subject progress, Analytics weak areas

### 3. Test Performance (`mockTestData`)
**Data**: Mock test results, scores, accuracy, subject-wise performance, weak topics
**Frontend Usage**: Analytics charts, Dashboard recent test, Performance tracking

### 4. Timetable & Tasks (`mockTimetableData`)
**Data**: Daily study schedule, task completion, time slots, subjects
**Frontend Usage**: Timetable component, Dashboard today's tasks

### 5. Flashcards (`mockFlashcards`)
**Data**: Question-answer pairs, difficulty levels, review schedules, subjects
**Frontend Usage**: Flashcard component, Spaced repetition system

### 6. Goals & Milestones (`mockGoals`)
**Data**: User goals, progress tracking, deadlines, priorities  
**Frontend Usage**: Dashboard goals, Calendar deadlines, Goal tracking

### 7. Motivational Content (`mockQuotes`)
**Data**: Daily quotes, study tips, motivational content
**Frontend Usage**: Dashboard quote rotation

## API Endpoints to Implement

### Authentication & User Management
```
POST /api/auth/register - User registration
POST /api/auth/login - User login  
GET /api/auth/me - Get current user
PUT /api/auth/profile - Update user profile
```

### User Stats & Gamification
```
GET /api/user/stats - Get user statistics (XP, streak, study hours)
PUT /api/user/stats - Update user stats
GET /api/user/badges - Get earned badges
POST /api/user/badges - Award new badge
GET /api/user/level - Calculate user level from XP
POST /api/user/xp - Add XP points
```

### Syllabus Management
```
GET /api/syllabus - Get complete syllabus (Mains + Advanced)
GET /api/syllabus/:type - Get syllabus by type (mains/advanced)
PUT /api/syllabus/topic/:id - Update topic status
GET /api/progress/overall - Get overall progress percentage
GET /api/progress/subject/:subject - Get subject progress
```

### Test Analytics  
```
GET /api/tests - Get user's test history
POST /api/tests - Record new test result
GET /api/tests/:id - Get specific test details
GET /api/analytics/performance - Get performance analytics
GET /api/analytics/weak-topics - Get weak areas analysis
```

### Timetable & Tasks
```
GET /api/timetable - Get user's timetable
POST /api/timetable - Create new task
PUT /api/timetable/:id - Update task
DELETE /api/timetable/:id - Delete task  
PUT /api/timetable/:id/complete - Mark task complete
GET /api/timetable/today - Get today's tasks
```

### Flashcards & Revision
```
GET /api/flashcards - Get user's flashcards
POST /api/flashcards - Create new flashcard
PUT /api/flashcards/:id - Update flashcard
DELETE /api/flashcards/:id - Delete flashcard
GET /api/flashcards/due - Get cards due for review
PUT /api/flashcards/:id/review - Record review result
```

### Goals & Calendar
```
GET /api/goals - Get user's goals
POST /api/goals - Create new goal
PUT /api/goals/:id - Update goal progress
DELETE /api/goals/:id - Delete goal
GET /api/calendar/events - Get calendar events
POST /api/calendar/events - Create calendar event
```

## MongoDB Data Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  totalXP: Number,
  currentStreak: Number,
  longestStreak: Number, 
  totalStudyHours: Number,
  level: Number,
  badges: [String],
  createdAt: Date,
  lastActiveDate: Date
}
```

### Syllabus Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'mains' or 'advanced'
  subject: String, // 'physics', 'chemistry', 'mathematics'
  topic: String,
  subtopics: [String],
  status: String, // 'mastered', 'in-progress', 'weak', 'revise-soon', 'not-started'
  highYield: Boolean,
  updatedAt: Date
}
```

### Test Model  
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'mains' or 'advanced'
  date: Date,
  score: Number,
  totalMarks: Number,
  accuracy: Number,
  timeSpent: Number,
  subjects: {
    physics: { score: Number, total: Number, accuracy: Number },
    chemistry: { score: Number, total: Number, accuracy: Number },
    mathematics: { score: Number, total: Number, accuracy: Number }
  },
  weakTopics: [String],
  createdAt: Date
}
```

### Timetable Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  day: String, // 'monday', 'tuesday', etc.
  time: String, // '6:00-8:00'
  subject: String,
  topic: String,
  completed: Boolean,
  createdAt: Date
}
```

### Flashcard Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  subject: String,
  topic: String,
  question: String,
  answer: String,
  difficulty: String, // 'easy', 'medium', 'hard'
  lastReviewed: Date,
  nextReview: Date,
  reviewCount: Number,
  correctCount: Number,
  createdAt: Date
}
```

### Goal Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  deadline: Date,
  progress: Number, // 0-100
  priority: String, // 'high', 'medium', 'low'
  category: String, // 'syllabus', 'performance', 'routine'
  createdAt: Date
}
```

## Frontend Integration Strategy

### 1. Replace Mock Data Imports
Remove mock data imports and replace with API calls using axios:
```javascript
// Replace: import { mockUserStats } from '../../mock/mockData';
// With: API calls to /api/user/stats
```

### 2. Add Loading States
Add loading spinners and skeleton screens for better UX:
```javascript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);
```

### 3. Error Handling
Implement proper error handling with toast notifications:
```javascript
try {
  const response = await axios.get('/api/user/stats');
  setData(response.data);
} catch (error) {
  toast.error('Failed to load data');
}
```

### 4. Real-time Updates
Implement optimistic updates for better user experience:
```javascript
// Update UI immediately, then sync with backend
```

### 5. Authentication Context
Add authentication context for user session management:
```javascript
// AuthContext to manage login state across components
```

## Implementation Priority

### Phase 1: Core Backend Setup
1. User authentication & profile management
2. Syllabus data models & CRUD operations
3. Basic progress tracking

### Phase 2: Interactive Features  
1. Test recording & analytics
2. Timetable management
3. XP & badge system

### Phase 3: Advanced Features
1. Flashcard system with spaced repetition
2. Goal tracking & calendar integration
3. Real-time sync & optimizations

## Data Migration Strategy

### Initial Syllabus Population
- Populate database with complete JEE syllabus structure
- Users get default syllabus on registration
- Personal progress tracked per user

### User Onboarding
- New users get welcome dashboard
- Pre-populated with sample goals and timetable
- Guided tour of features

This contract ensures seamless integration between frontend and backend while maintaining all existing functionality with real data persistence.