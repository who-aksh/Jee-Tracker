import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Brain, 
  CalendarDays,
  Trophy,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Syllabus', path: '/syllabus' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Calendar, label: 'Timetable', path: '/timetable' },
    { icon: Brain, label: 'Flashcards', path: '/flashcards' },
    { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
    { icon: Trophy, label: 'Goals', path: '/goals' },
  ];

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Glassmorphism Background */}
        <div className="h-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
                  JEE Tracker
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-teal-600 dark:hover:text-teal-400'
                    }`}
                  >
                    <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-teal-600 dark:hover:text-teal-400"
              >
                {isDarkMode ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
                <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleMobile}
        />
      )}
    </>
  );
};

export default Sidebar;