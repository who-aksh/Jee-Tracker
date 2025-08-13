import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Flame,
  BookOpen,
  Trophy,
  Calendar,
  Quote,
  CheckCircle,
  Circle,
  Star
} from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { mockSyllabusData, mockUserStats, mockTimetableData, mockGoals, mockQuotes, mockTestData } from '../../mock/mockData';

const CompleteDashboard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [todaysTasks, setTodaysTasks] = useState([]);

  useEffect(() => {
    // Rotate quotes every 15 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % mockQuotes.length);
    }, 15000);

    // Get today's tasks
    const today = new Date().getDay();
    const dayMap = {
      0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 
      4: 'thursday', 5: 'friday', 6: 'saturday'
    };
    const todayName = dayMap[today];
    const tasks = mockTimetableData.filter(task => 
      task.day.toLowerCase() === todayName
    );
    setTodaysTasks(tasks);

    return () => clearInterval(quoteInterval);
  }, []);

  // Calculate overall progress
  const calculateProgress = () => {
    const allTopics = [
      ...mockSyllabusData.mains.physics,
      ...mockSyllabusData.mains.chemistry,
      ...mockSyllabusData.mains.mathematics,
      ...mockSyllabusData.advanced.physics,
      ...mockSyllabusData.advanced.chemistry,
      ...mockSyllabusData.advanced.mathematics
    ];

    const completed = allTopics.filter(topic => topic.status === 'mastered').length;
    return Math.round((completed / allTopics.length) * 100);
  };

  const overallProgress = calculateProgress();

  // Calculate weekly progress (mock calculation)
  const weeklyProgress = 78; // This would come from actual weekly tracking

  const statCards = [
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      progress: overallProgress,
      change: '+5.2%'
    },
    {
      title: 'Current Streak',
      value: `${mockUserStats.currentStreak} days`,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      subtext: `Best: ${mockUserStats.longestStreak} days`
    },
    {
      title: 'Total XP',
      value: mockUserStats.totalXP.toLocaleString(),
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      change: '+145 today'
    },
    {
      title: 'Study Hours',
      value: `${mockUserStats.totalStudyHours}h`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      subtext: '~6.8h daily avg'
    }
  ];

  const topGoals = mockGoals.slice(0, 3);
  const recentTest = mockTestData[0];

  const markTaskComplete = (taskId) => {
    // This would update the task status - mock implementation
    console.log(`Marking task ${taskId} as complete`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header with Dynamic Greeting */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, Champion! 🎯
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Day {mockUserStats.currentStreak} of your journey to JEE success
        </p>
      </div>

      {/* Motivational Quote & Daily Tip */}
      <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 dark:bg-teal-600/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="flex items-start space-x-4 relative">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
              <Quote size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              "{mockQuotes[currentQuote].quote}"
            </blockquote>
            <div className="flex items-start space-x-2 text-teal-700 dark:text-teal-300">
              <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">💡</span>
              </div>
              <div>
                <span className="font-semibold">Daily Strategy Tip:</span>
                <p className="mt-1">{mockQuotes[currentQuote].tip}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-white" />
                </div>
                {stat.change && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </p>
              {stat.progress && (
                <div className="mb-2">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
              {stat.subtext && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtext}</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Plan</h3>
            </div>
            <Badge variant="outline">{todaysTasks.filter(t => t.completed).length}/{todaysTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <button
                    onClick={() => markTaskComplete(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-teal-500 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {task.topic}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.subject} • {task.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No tasks scheduled for today</p>
                <Button size="sm" className="mt-2">Add Task</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Priority Goals */}
        <Card className="lg:col-span-1 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Priority Goals</h3>
            </div>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          <div className="space-y-4">
            {topGoals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                  <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                    {goal.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <Progress value={goal.progress} className="flex-1 mr-3 h-2" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due: {goal.deadline}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Performance */}
        <Card className="lg:col-span-1 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Test</h3>
            </div>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          
          {recentTest ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-800/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {recentTest.type === 'mains' ? 'JEE Mains' : 'JEE Advanced'} Mock
                  </p>
                  <Badge variant="outline">{recentTest.date}</Badge>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {recentTest.score}/{recentTest.totalMarks}
                  </span>
                  <Badge variant={recentTest.accuracy >= 80 ? 'default' : recentTest.accuracy >= 60 ? 'secondary' : 'destructive'}>
                    {recentTest.accuracy}% Accuracy
                  </Badge>
                </div>
                <Progress value={recentTest.accuracy} className="mb-3" />
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                    <p className="text-gray-600 dark:text-gray-400">Physics</p>
                    <p className="font-semibold">{recentTest.subjects.physics.accuracy}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                    <p className="text-gray-600 dark:text-gray-400">Chemistry</p>
                    <p className="font-semibold">{recentTest.subjects.chemistry.accuracy}%</p>
                  </div>
                  <div className="text-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                    <p className="text-gray-600 dark:text-gray-400">Maths</p>
                    <p className="font-semibold">{recentTest.subjects.mathematics.accuracy}%</p>
                  </div>
                </div>
              </div>
              
              {recentTest.weakTopics.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Areas to Focus:</p>
                  <div className="flex flex-wrap gap-1">
                    {recentTest.weakTopics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p>No tests taken yet</p>
              <Button size="sm" className="mt-2">Take Mock Test</Button>
            </div>
          )}
        </Card>
      </div>

      {/* Subject Progress Overview */}
      <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Mastery</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">JEE Mains</Badge>
            <Button size="sm" variant="outline">View Advanced</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(mockSyllabusData.mains).map(([subject, topics]) => {
            const completed = topics.filter(topic => topic.status === 'mastered').length;
            const inProgress = topics.filter(topic => topic.status === 'in-progress').length;
            const highYield = topics.filter(topic => topic.highYield).length;
            const progress = Math.round((completed / topics.length) * 100);
            
            return (
              <div key={subject} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      className="stroke-gray-200 dark:stroke-gray-700"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18" cy="18" r="16"
                      fill="none"
                      className="stroke-teal-500"
                      strokeWidth="3"
                      strokeDasharray={`${progress} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-teal-600">{progress}%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">{subject}</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{completed} mastered</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Circle size={14} className="text-blue-500" />
                    <span>{inProgress} in progress</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star size={14} className="text-yellow-500" />
                    <span>{highYield} high yield</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CompleteDashboard;