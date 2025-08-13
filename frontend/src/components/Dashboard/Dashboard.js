import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Flame,
  BookOpen,
  Trophy,
  Calendar,
  Quote
} from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { mockSyllabusData, mockUserStats, mockTimetableData, mockGoals, mockQuotes } from '../../mock/mockData';

const Dashboard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [todaysTasks, setTodaysTasks] = useState([]);

  useEffect(() => {
    // Rotate quotes every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % mockQuotes.length);
    }, 10000);

    // Get today's tasks
    const today = new Date().toLocaleLowerCase();
    const dayMap = {
      0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 
      4: 'thursday', 5: 'friday', 6: 'saturday'
    };
    const todayName = dayMap[new Date().getDay()];
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

  const statCards = [
    {
      title: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: TrendingUp,
      color: 'from-teal-500 to-teal-600',
      progress: overallProgress
    },
    {
      title: 'Current Streak',
      value: `${mockUserStats.currentStreak} days`,
      icon: Flame,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Total XP',
      value: mockUserStats.totalXP,
      icon: Trophy,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Study Hours',
      value: `${mockUserStats.totalStudyHours}h`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const topGoals = mockGoals.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, Achiever! 🎯
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let's make today another step closer to your JEE success
        </p>
      </div>

      {/* Quote & Tip Card */}
      <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200 dark:border-teal-700">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
              <Quote size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              "{mockQuotes[currentQuote].quote}"
            </blockquote>
            <div className="flex items-center text-sm text-teal-700 dark:text-teal-300">
              <span className="font-semibold">💡 Quick Tip: </span>
              <span className="ml-2">{mockQuotes[currentQuote].tip}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              {stat.progress && (
                <div className="mt-4">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          </div>
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{task.topic}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject} • {task.time}</p>
                    </div>
                  </div>
                  <Badge variant={task.completed ? 'default' : 'secondary'}>
                    {task.completed ? 'Done' : 'Pending'}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">No tasks scheduled for today</p>
            )}
          </div>
        </Card>

        {/* Top Goals */}
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Goals</h3>
          </div>
          <div className="space-y-4">
            {topGoals.map((goal) => (
              <div key={goal.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                  <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                    {goal.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
                <div className="flex items-center justify-between">
                  <Progress value={goal.progress} className="flex-1 mr-3 h-2" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center mb-6">
          <BookOpen className="w-5 h-5 text-teal-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Progress</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(mockSyllabusData.mains).map(([subject, topics]) => {
            const completed = topics.filter(topic => topic.status === 'mastered').length;
            const progress = Math.round((completed / topics.length) * 100);
            
            return (
              <div key={subject} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
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
                <h4 className="font-semibold text-gray-900 dark:text-white capitalize">{subject}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{completed}/{topics.length} topics</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;