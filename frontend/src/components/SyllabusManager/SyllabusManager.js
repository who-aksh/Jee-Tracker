import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Target
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { mockSyllabusData } from '../../mock/mockData';

const SyllabusManager = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('mains');

  const statusConfig = {
    'mastered': { icon: CheckCircle, color: 'bg-green-500', label: 'Mastered', textColor: 'text-green-700 dark:text-green-300' },
    'in-progress': { icon: Circle, color: 'bg-blue-500', label: 'In Progress', textColor: 'text-blue-700 dark:text-blue-300' },
    'revise-soon': { icon: Clock, color: 'bg-yellow-500', label: 'Revise Soon', textColor: 'text-yellow-700 dark:text-yellow-300' },
    'weak': { icon: AlertCircle, color: 'bg-red-500', label: 'Weak Area', textColor: 'text-red-700 dark:text-red-300' },
    'not-started': { icon: Circle, color: 'bg-gray-400', label: 'Not Started', textColor: 'text-gray-600 dark:text-gray-400' }
  };

  const toggleSection = (subject) => {
    setExpandedSections(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const toggleTopicStatus = (subject, topicId) => {
    // This would be connected to backend later
    console.log(`Toggle status for ${subject} - ${topicId}`);
  };

  const getFilteredTopics = (topics, subject) => {
    let filtered = topics;
    
    if (searchTerm) {
      filtered = filtered.filter(topic => 
        topic.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.subtopics.some(subtopic => 
          subtopic.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(topic => topic.status === filterStatus);
    }
    
    return filtered;
  };

  const calculateSubjectProgress = (topics) => {
    const mastered = topics.filter(topic => topic.status === 'mastered').length;
    return Math.round((mastered / topics.length) * 100);
  };

  const currentSyllabus = mockSyllabusData[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Syllabus Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your progress through the complete JEE syllabus
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

      {/* Filters and Search */}
      <Card className="p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="flex items-center gap-1"
              >
                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Subject Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(currentSyllabus).map(([subject, topics]) => {
          const progress = calculateSubjectProgress(topics);
          const mastered = topics.filter(t => t.status === 'mastered').length;
          const highYieldTopics = topics.filter(t => t.highYield).length;
          
          return (
            <Card key={subject} className="p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{subject}</h3>
                <Badge variant="secondary">{progress}%</Badge>
              </div>
              <Progress value={progress} className="mb-3" />
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Completed: {mastered}/{topics.length} topics</div>
                <div>High Yield: {highYieldTopics} topics</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Subject Sections */}
      <div className="space-y-4">
        {Object.entries(currentSyllabus).map(([subject, topics]) => {
          const filteredTopics = getFilteredTopics(topics, subject);
          const isExpanded = expandedSections[subject];
          
          return (
            <Card key={subject} className="bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              {/* Subject Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                onClick={() => toggleSection(subject)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <BookOpen className="text-teal-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {filteredTopics.length} topics
                    </Badge>
                    <Badge variant="outline">
                      {calculateSubjectProgress(topics)}% Complete
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="border-t border-gray-200/50 dark:border-gray-700/50">
                  {filteredTopics.map((topic) => {
                    const StatusIcon = statusConfig[topic.status].icon;
                    
                    return (
                      <div 
                        key={topic.id} 
                        className="p-4 border-b last:border-b-0 border-gray-200/30 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleTopicStatus(subject, topic.id)}
                              className="mt-1 hover:scale-110 transition-transform duration-200"
                            >
                              <StatusIcon 
                                size={20} 
                                className={`${statusConfig[topic.status].color.replace('bg-', 'text-')}`}
                              />
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {topic.topic}
                                </h4>
                                {topic.highYield && (
                                  <Badge variant="destructive" className="text-xs">
                                    <Target size={12} className="mr-1" />
                                    High Yield
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                {topic.subtopics.map((subtopic, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="text-xs"
                                  >
                                    {subtopic}
                                  </Badge>
                                ))}
                              </div>
                              
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${statusConfig[topic.status].textColor}`}
                              >
                                {statusConfig[topic.status].label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusManager;