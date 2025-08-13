import React, { useState } from 'react';
import { 
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  Zap,
  TrendingUp,
  Calendar,
  BookOpen,
  Brain,
  Clock,
  CheckCircle,
  Medal,
  Crown,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { mockUserStats } from '../../mock/mockData';

const Gamification = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Extended badge system
  const allBadges = [
    ...mockUserStats.badges,
    { id: 'badge5', name: 'Speed Demon', description: 'Complete 5 topics in one day', earned: false, icon: Zap, color: 'text-yellow-500' },
    { id: 'badge6', name: 'Night Owl', description: 'Study after 11 PM for 7 days', earned: false, icon: Clock, color: 'text-purple-500' },
    { id: 'badge7', name: 'Perfectionist', description: 'Score 100% in 3 mock tests', earned: false, icon: Target, color: 'text-pink-500' },
    { id: 'badge8', name: 'Consistency King', description: '30 day study streak', earned: false, icon: Crown, color: 'text-gold-500' },
  ];

  // Achievements system
  const achievements = [
    { 
      id: 'ach1', 
      title: 'Study Warrior', 
      description: 'Complete 100 hours of study', 
      progress: 75, 
      maxValue: 100, 
      currentValue: 75,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      reward: '50 XP'
    },
    { 
      id: 'ach2', 
      title: 'Mock Master', 
      description: 'Take 50 mock tests', 
      progress: 40, 
      maxValue: 50, 
      currentValue: 20,
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      reward: '100 XP + Badge'
    },
    { 
      id: 'ach3', 
      title: 'Topic Champion', 
      description: 'Master 25 topics', 
      progress: 48, 
      maxValue: 25, 
      currentValue: 12,
      icon: Star,
      color: 'from-green-500 to-green-600',
      reward: '75 XP'
    },
    { 
      id: 'ach4', 
      title: 'Streak Legend', 
      description: 'Maintain 50 day streak', 
      progress: 30, 
      maxValue: 50, 
      currentValue: 15,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      reward: '200 XP + Special Badge'
    }
  ];

  // Level calculation
  const calculateLevel = (xp) => {
    return Math.floor(xp / 500) + 1;
  };

  const calculateXPToNextLevel = (xp) => {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = (currentLevel - 1) * 500;
    const xpForNextLevel = currentLevel * 500;
    return xpForNextLevel - xp;
  };

  const calculateLevelProgress = (xp) => {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = (currentLevel - 1) * 500;
    const xpForNextLevel = currentLevel * 500;
    const progressInLevel = xp - xpForCurrentLevel;
    return Math.round((progressInLevel / (xpForNextLevel - xpForCurrentLevel)) * 100);
  };

  const currentLevel = calculateLevel(mockUserStats.totalXP);
  const xpToNextLevel = calculateXPToNextLevel(mockUserStats.totalXP);
  const levelProgress = calculateLevelProgress(mockUserStats.totalXP);

  // Leaderboard (mock data)
  const leaderboard = [
    { rank: 1, name: 'Alex Kumar', xp: 3200, level: 7, badge: Crown },
    { rank: 2, name: 'Priya Singh', xp: 2800, level: 6, badge: Medal },
    { rank: 3, name: 'You', xp: mockUserStats.totalXP, level: currentLevel, badge: Trophy },
    { rank: 4, name: 'Rahul Sharma', xp: 2200, level: 5, badge: Award },
    { rank: 5, name: 'Anita Gupta', xp: 2100, level: 5, badge: Award },
  ];

  // Weekly challenges (mock data)
  const challenges = [
    { 
      id: 'ch1', 
      title: 'Speed Study', 
      description: 'Complete 10 flashcard reviews in under 5 minutes', 
      progress: 60, 
      reward: '50 XP',
      timeLeft: '2 days',
      type: 'weekly'
    },
    { 
      id: 'ch2', 
      title: 'Perfect Score', 
      description: 'Score 90%+ in any mock test', 
      progress: 0, 
      reward: '100 XP + Badge',
      timeLeft: '5 days',
      type: 'weekly'
    },
    { 
      id: 'ch3', 
      title: 'Daily Dedication', 
      description: 'Study for 3+ hours every day this week', 
      progress: 86, 
      reward: '75 XP',
      timeLeft: '1 day',
      type: 'weekly'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gamification Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your achievements, earn badges, and level up your JEE preparation
          </p>
        </div>
        
        {/* Level Display */}
        <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Current Level</p>
              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">Level {currentLevel}</p>
              <p className="text-xs text-teal-700 dark:text-teal-300">{xpToNextLevel} XP to next level</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="p-1 bg-gray-100 dark:bg-gray-800 inline-flex rounded-lg">
        {['overview', 'achievements', 'badges', 'leaderboard'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 capitalize ${
              activeTab === tab 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* XP Progress */}
          <Card className="lg:col-span-2 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h3>
            </div>
            
            <div className="space-y-6">
              {/* Level Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Level {currentLevel} → Level {currentLevel + 1}
                  </span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>{mockUserStats.totalXP} XP</span>
                  <span>{currentLevel * 500} XP needed</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{mockUserStats.totalXP}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Total XP</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/20">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-100">{mockUserStats.currentStreak}</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">Current Streak</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    {allBadges.filter(b => b.earned).length}
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Badges Earned</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">{mockUserStats.totalStudyHours}</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Study Hours</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Weekly Challenges */}
          <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-teal-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Challenges</h3>
            </div>
            
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{challenge.title}</h4>
                    <Badge variant="outline" className="text-xs">{challenge.timeLeft}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
                  <div className="space-y-2">
                    <Progress value={challenge.progress} className="h-1" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{challenge.progress}% complete</span>
                      <Badge variant="secondary" className="text-xs">{challenge.reward}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const isCompleted = achievement.progress >= 100;
            
            return (
              <Card key={achievement.id} className={`p-6 transition-all duration-200 hover:scale-105 ${
                isCompleted 
                  ? 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700' 
                  : 'bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${achievement.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {achievement.currentValue}/{achievement.maxValue}
                    </span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{achievement.progress}%</span>
                    <Badge variant={isCompleted ? 'default' : 'secondary'} className="text-xs">
                      {achievement.reward}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map((badge) => {
            const Icon = badge.icon || Award;
            
            return (
              <Card key={badge.id} className={`p-6 text-center transition-all duration-200 hover:scale-105 ${
                badge.earned 
                  ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  badge.earned 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}>
                  <Icon size={32} />
                </div>
                
                <h3 className={`font-semibold mb-2 ${
                  badge.earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {badge.name}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  badge.earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {badge.description}
                </p>
                
                {badge.earned ? (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle size={12} className="mr-1" />
                    Earned
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Not Earned
                  </Badge>
                )}
                
                {badge.earned && badge.earnedDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Earned on {badge.earnedDate}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-6">
            <Trophy className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Leaderboard</h3>
          </div>
          
          <div className="space-y-3">
            {leaderboard.map((user) => {
              const BadgeIcon = user.badge;
              const isCurrentUser = user.name === 'You';
              
              return (
                <div key={user.rank} className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 ${
                  isCurrentUser 
                    ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-2 border-teal-200 dark:border-teal-700' 
                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    user.rank === 2 ? 'bg-gray-300 text-gray-800' :
                    user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium ${isCurrentUser ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-white'}`}>
                        {user.name}
                      </p>
                      {isCurrentUser && <Badge variant="outline" className="text-xs">You</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level {user.level}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{user.xp.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">XP</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <BadgeIcon className={`w-6 h-6 ${
                      user.rank === 1 ? 'text-yellow-500' :
                      user.rank === 2 ? 'text-gray-400' :
                      user.rank === 3 ? 'text-orange-500' :
                      'text-gray-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">View Full Leaderboard</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Gamification;