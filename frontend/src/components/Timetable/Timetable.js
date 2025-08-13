import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Circle,
  PlayCircle,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { mockTimetableData } from '../../mock/mockData';

const Timetable = () => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [studyTimer, setStudyTimer] = useState({ active: false, time: 0, subject: null });
  const [newTask, setNewTask] = useState({
    time: '',
    subject: '',
    topic: ''
  });

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  
  const subjectColors = {
    'Physics': 'bg-blue-500',
    'Chemistry': 'bg-green-500',
    'Mathematics': 'bg-purple-500'
  };

  const getTasksForDay = (day) => {
    return mockTimetableData.filter(task => task.day.toLowerCase() === day.toLowerCase());
  };

  const toggleTaskCompletion = (taskId) => {
    // Mock function - would update backend
    console.log(`Toggle completion for task ${taskId}`);
  };

  const startStudyTimer = (subject, topic) => {
    setStudyTimer({ active: true, time: 0, subject, topic });
    // Start actual timer logic here
  };

  const stopStudyTimer = () => {
    setStudyTimer({ active: false, time: studyTimer.time, subject: null });
  };

  const addNewTask = () => {
    if (newTask.time && newTask.subject && newTask.topic) {
      // Mock function - would save to backend
      console.log('Adding new task:', { ...newTask, day: selectedDay });
      setNewTask({ time: '', subject: '', topic: '' });
      setIsAddingTask(false);
    }
  };

  const calculateDayProgress = (day) => {
    const tasks = getTasksForDay(day);
    const completed = tasks.filter(task => task.completed).length;
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  };

  const getWeeklyProgress = () => {
    const totalTasks = mockTimetableData.length;
    const completedTasks = mockTimetableData.filter(task => task.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Timetable & Daily Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your study schedule and track daily progress
          </p>
        </div>
        
        {/* Study Timer */}
        <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20 border-teal-200 dark:border-teal-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                {String(Math.floor(studyTimer.time / 60)).padStart(2, '0')}:
                {String(studyTimer.time % 60).padStart(2, '0')}
              </span>
            </div>
            {studyTimer.active ? (
              <Button size="sm" onClick={stopStudyTimer} className="flex items-center space-x-1">
                <PauseCircle size={16} />
                <span>Pause</span>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                <PlayCircle size={16} className="mr-1" />
                Start Study
              </Button>
            )}
            {studyTimer.subject && (
              <Badge variant="secondary">{studyTimer.subject}</Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
          <Badge variant="outline">{getWeeklyProgress()}% Complete</Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((day) => {
            const progress = calculateDayProgress(day);
            const tasks = getTasksForDay(day);
            const isSelected = selectedDay === day;
            
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg' 
                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <p className={`font-medium text-center mb-2 capitalize ${
                  isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {day.substring(0, 3)}
                </p>
                <div className="space-y-2">
                  <Progress value={progress} className="h-1" />
                  <p className={`text-xs text-center ${
                    isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {tasks.filter(t => t.completed).length}/{tasks.length} tasks
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Schedule */}
        <Card className="lg:col-span-2 p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {selectedDay} Schedule
              </h3>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </Button>
          </div>

          {/* Add New Task Form */}
          {isAddingTask && (
            <Card className="p-4 mb-6 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Time</label>
                  <Input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    placeholder="09:00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Subject</label>
                  <select
                    value={newTask.subject}
                    onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Topic</label>
                  <Input
                    value={newTask.topic}
                    onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                    placeholder="Enter topic"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={addNewTask}>Add Task</Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {getTasksForDay(selectedDay).length > 0 ? (
              getTasksForDay(selectedDay).map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-teal-500 transition-colors" />
                    )}
                  </button>
                  
                  <div className={`w-3 h-12 rounded-full ${subjectColors[task.subject] || 'bg-gray-400'}`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium ${
                        task.completed 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.topic}
                      </p>
                      <Badge variant="outline" className="text-xs">{task.time}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startStudyTimer(task.subject, task.topic)}
                      className="p-2"
                    >
                      <PlayCircle size={16} />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Edit3 size={16} />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No tasks scheduled for {selectedDay}</p>
                <p>Add your first task to get started with planning your day</p>
                <Button className="mt-4" onClick={() => setIsAddingTask(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Task
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Study Statistics */}
        <Card className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center mb-4">
            <RotateCcw className="w-5 h-5 text-teal-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Stats</h3>
          </div>
          
          <div className="space-y-4">
            {/* Daily Progress */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-800/20">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Today's Progress</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-teal-600">{calculateDayProgress(selectedDay)}%</span>
                <Badge variant="outline">
                  {getTasksForDay(selectedDay).filter(t => t.completed).length}/
                  {getTasksForDay(selectedDay).length}
                </Badge>
              </div>
              <Progress value={calculateDayProgress(selectedDay)} className="h-2" />
            </div>

            {/* Subject Distribution */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Subject Distribution</p>
              <div className="space-y-2">
                {subjects.map(subject => {
                  const subjectTasks = getTasksForDay(selectedDay).filter(task => task.subject === subject);
                  const percentage = getTasksForDay(selectedDay).length > 0 
                    ? Math.round((subjectTasks.length / getTasksForDay(selectedDay).length) * 100)
                    : 0;
                  
                  return (
                    <div key={subject} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${subjectColors[subject]}`}></div>
                        <span className="text-sm text-gray-900 dark:text-white">{subject}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{percentage}%</span>
                        <Badge variant="secondary" className="text-xs">{subjectTasks.length}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">This Week</p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-blue-600 dark:text-blue-400">Total Tasks</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{mockTimetableData.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-300">
                    {mockTimetableData.filter(t => t.completed).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;