import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';

// Simple test component first
const TestDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">JEE Tracker Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
          <p className="text-2xl font-bold text-teal-600">65%</p>
        </div>
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Streak</h3>
          <p className="text-2xl font-bold text-orange-600">15 days</p>
        </div>
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total XP</h3>
          <p className="text-2xl font-bold text-purple-600">2450</p>
        </div>
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Hours</h3>
          <p className="text-2xl font-bold text-blue-600">245h</p>
        </div>
      </div>
    </div>
  );
};

// Placeholder components - to be implemented
const Syllabus = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Syllabus Manager - Coming Soon</h1></div>;
const Analytics = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Test Analytics - Coming Soon</h1></div>;
const Timetable = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable & Daily Plan - Coming Soon</h1></div>;
const Flashcards = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flashcards & Revision - Coming Soon</h1></div>;
const Calendar = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar & Goal Tracking - Coming Soon</h1></div>;
const Goals = () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gamification & Goals - Coming Soon</h1></div>;

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
        <BrowserRouter>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen">
              <div className="p-6 pt-20 lg:pt-6">
                <Routes>
                  <Route path="/" element={<TestDashboard />} />
                  <Route path="/syllabus" element={<Syllabus />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/timetable" element={<Timetable />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/goals" element={<Goals />} />
                </Routes>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;