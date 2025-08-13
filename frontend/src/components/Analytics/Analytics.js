import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Clock,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { mockTestData } from '../../mock/mockData';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('mains');
  const [timeRange, setTimeRange] = useState('all');

  const getFilteredTests = () => {
    return mockTestData.filter(test => test.type === activeTab);
  };

  const calculateAverageScore = (tests) => {
    if (tests.length === 0) return 0;
    const totalScore = tests.reduce((sum, test) => sum + (test.score / test.totalMarks) * 100, 0);
    return Math.round(totalScore / tests.length);
  };

  const calculateTrend = (tests) => {
    if (tests.length < 2) return { trend: 'stable', value: 0 };
    
    const latest = (tests[0].score / tests[0].totalMarks) * 100;
    const previous = (tests[1].score / tests[1].totalMarks) * 100;
    const diff = latest - previous;
    
    return {
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      value: Math.abs(diff)
    };
  };

  const getWeakTopics = (tests) => {
    const topicMap = new Map();
    
    tests.forEach(test => {
      test.weakTopics.forEach(topic => {
        topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
      });
    });
    
    return Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const filteredTests = getFilteredTests();
  const averageScore = calculateAverageScore(filteredTests);
  const trend = calculateTrend(filteredTests);
  const weakTopics = getWeakTopics(filteredTests);

  const statCards = [
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: Target,
      color: 'from-teal-500 to-teal-600',
      trend: trend.trend,
      trendValue: trend.value
    },
    {
      title: 'Tests Taken',
      value: filteredTests.length,
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Best Score',
      value: filteredTests.length > 0 ? `${Math.max(...filteredTests.map(t => Math.round((t.score / t.totalMarks) * 100)))}%` : '0%',
      icon: Award,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Avg Time',
      value: filteredTests.length > 0 ? `${Math.round(filteredTests.reduce((sum, t) => sum + t.timeSpent, 0) / filteredTests.length)}m` : '0m',
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mock Test Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your performance and identify areas for improvement
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('mains')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'mains' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            JEE Mains
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === 'advanced' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            JEE Advanced
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : null;
          
          return (
            <Card key={index} className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                {stat.trend && TrendIcon && (
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon size={16} className="mr-1" />
                    {stat.trendValue.toFixed(1)}%
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tests</h3>
          </div>
          <div className="space-y-4">
            {filteredTests.length > 0 ? (
              filteredTests.slice(0, 3).map((test) => {
                const percentage = Math.round((test.score / test.totalMarks) * 100);
                
                return (
                  <div key={test.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {test.type === 'mains' ? 'JEE Mains' : 'JEE Advanced'} Mock Test
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{test.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{test.score}/{test.totalMarks}</p>
                        <Badge variant={percentage >= 80 ? 'default' : percentage >= 60 ? 'secondary' : 'destructive'}>
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={percentage} className="h-2" />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Physics</p>
                          <p className="font-semibold">{test.subjects.physics.accuracy}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Chemistry</p>
                          <p className="font-semibold">{test.subjects.chemistry.accuracy}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Maths</p>
                          <p className="font-semibold">{test.subjects.mathematics.accuracy}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No tests taken yet</p>
                <p className="text-sm">Start taking mock tests to see your analytics</p>
              </div>
            )}
          </div>
        </Card>

        {/* Weak Topics */}
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weak Areas</h3>
          </div>
          <div className="space-y-3">
            {weakTopics.length > 0 ? (
              weakTopics.map(([topic, count], index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{topic}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Appeared in {count} test{count > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Badge variant="destructive">{count}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <Target size={48} className="mx-auto mb-4 opacity-50" />
                <p>No weak areas identified</p>
                <p className="text-sm">Keep taking tests to track your weak areas</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-5 h-5 text-teal-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject-wise Performance</h3>
        </div>
        
        {filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['physics', 'chemistry', 'mathematics'].map((subject) => {
              const subjectScores = filteredTests.map(test => test.subjects[subject].accuracy);
              const avgScore = Math.round(subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length);
              const bestScore = Math.max(...subjectScores);
              
              return (
                <div key={subject} className="text-center">
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
                        strokeDasharray={`${avgScore} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-teal-600">{avgScore}%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">{subject}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Best: {bestScore}%</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            <BarChart3 size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No performance data available</p>
            <p>Take mock tests to see your subject-wise performance analysis</p>
            <Button className="mt-4">Take Your First Mock Test</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;