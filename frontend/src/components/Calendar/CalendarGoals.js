import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  Target,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Award,
  Flag,
  BookOpen
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Calendar } from '../ui/calendar';
import { mockGoals, examDates } from '../../mock/mockData';

const CalendarGoals = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Mock events for calendar
  const events = [
    { date: '2024-12-20', title: 'Physics Mock Test', type: 'test', priority: 'high' },
    { date: '2024-12-22', title: 'Complete Calculus Chapter', type: 'study', priority: 'medium' },
    { date: '2024-12-25', title: 'Chemistry Revision', type: 'revision', priority: 'medium' },
    { date: '2024-12-28', title: 'JEE Mains Practice', type: 'practice', priority: 'high' },
    { date: '2024-12-31', title: 'Year-end Assessment', type: 'milestone', priority: 'high' },
  ];

  const eventTypes = {
    test: { color: 'bg-red-500', icon: AlertCircle },
    study: { color: 'bg-blue-500', icon: BookOpen },
    revision: { color: 'bg-yellow-500', icon: Target },
    practice: { color: 'bg-green-500', icon: TrendingUp },
    milestone: { color: 'bg-purple-500', icon: Flag }
  };

  const priorityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'border-green-500 bg-green-50 dark:bg-green-900/20'
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const upcoming = mockGoals.filter(goal => {
      const deadline = new Date(goal.deadline);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7;
    });
    return upcoming.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  };

  const formatDateRelative = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getExamCountdown = () => {
    const today = new Date();
    const mainDate = new Date(examDates.jeeMainsSession1);
    const diffTime = mainDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Calendar & Goal Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your schedule and track your progress towards JEE success
          </p>
        </div>
        
        {/* JEE Exam Countdown */}
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 border-orange-200 dark:border-orange-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">JEE Mains</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {getExamCountdown()} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1 bg-gray-100 dark:bg-gray-800 inline-flex rounded-lg">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'calendar' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'goals' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Goals & Milestones
        </button>
      </Card>

      {activeTab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Calendar</h3>
              <Button size="sm" className="flex items-center space-x-1">
                <Plus size={16} />
                <span>Add Event</span>
              </Button>
            </div>
            
            <div className="mb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-gray-200 dark:border-gray-700"
                modifiers={{
                  hasEvents: (date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return events.some(event => event.date === dateStr);
                  }
                }}
                modifiersStyles={{
                  hasEvents: {
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    color: 'rgb(20, 184, 166)',
                    fontWeight: 'bold'
                  }
                }}
              />
            </div>

            {/* Events for Selected Date */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Events for {selectedDate?.toLocaleDateString()}
              </h4>
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event, index) => {
                    const EventIcon = eventTypes[event.type]?.icon || CalendarIcon;
                    return (
                      <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 ${priorityColors[event.priority]}`}>
                        <div className={`w-8 h-8 rounded-full ${eventTypes[event.type]?.color} flex items-center justify-center`}>
                          <EventIcon size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
                            <Badge variant={event.priority === 'high' ? 'destructive' : event.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                              {event.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No events scheduled for this date</p>
                    <Button size="sm" className="mt-2">Add Event</Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h3>
            </div>

            <div className="space-y-3">
              {getUpcomingDeadlines().map((goal) => (
                <div key={goal.id} className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-800/20 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                    <Badge variant="destructive" className="text-xs">
                      {formatDateRelative(goal.deadline)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={goal.progress} className="h-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{goal.progress}% complete</span>
                      <span className="text-orange-600 dark:text-orange-400">{goal.priority} priority</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Important Exam Dates */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Important Dates</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">JEE Mains S1</span>
                  <span className="text-xs text-blue-700 dark:text-blue-300">Jan 24, 2024</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-900/20">
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">JEE Mains S2</span>
                  <span className="text-xs text-green-700 dark:text-green-300">Apr 04, 2024</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-purple-50 dark:bg-purple-900/20">
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-100">JEE Advanced</span>
                  <span className="text-xs text-purple-700 dark:text-purple-300">May 26, 2024</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Goals Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals List */}
          <Card className="lg:col-span-2 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Goals</h3>
              <Button size="sm" className="flex items-center space-x-1">
                <Plus size={16} />
                <span>New Goal</span>
              </Button>
            </div>

            <div className="space-y-4">
              {mockGoals.map((goal) => (
                <Card 
                  key={goal.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedGoal?.id === goal.id 
                      ? 'ring-2 ring-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        goal.priority === 'high' ? 'bg-red-500' : 
                        goal.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                        {goal.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Deadline: {goal.deadline}</span>
                      <span className="text-gray-500 dark:text-gray-400">{formatDateRelative(goal.deadline)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Goal Details / Stats */}
          <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            {selectedGoal ? (
              <div>
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Details</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedGoal.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGoal.description}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-center mb-3">
                      <div className="w-20 h-20 mx-auto mb-2 relative">
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
                            strokeDasharray={`${selectedGoal.progress} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-teal-600">{selectedGoal.progress}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 rounded bg-white/50 dark:bg-gray-700/50">
                        <p className="text-gray-600 dark:text-gray-400">Priority</p>
                        <p className="font-semibold capitalize">{selectedGoal.priority}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-white/50 dark:bg-gray-700/50">
                        <p className="text-gray-600 dark:text-gray-400">Category</p>
                        <p className="font-semibold capitalize">{selectedGoal.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="sm" className="w-full">Update Progress</Button>
                    <Button size="sm" variant="outline" className="w-full">Edit Goal</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <Award className="w-5 h-5 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals Overview</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20">
                      <p className="text-2xl font-bold text-teal-600">{mockGoals.length}</p>
                      <p className="text-sm text-teal-700 dark:text-teal-300">Total Goals</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <p className="text-2xl font-bold text-green-600">
                        {mockGoals.filter(g => g.progress >= 80).length}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">Near Complete</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Average Progress</p>
                    <Progress 
                      value={Math.round(mockGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockGoals.length)} 
                      className="h-2" 
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {Math.round(mockGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockGoals.length)}% overall completion
                    </p>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Select a goal to view details
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarGoals;