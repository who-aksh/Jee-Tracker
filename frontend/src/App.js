import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';

// Placeholder components - to be implemented
const Syllabus = () => <div className="p-8"><h1 className="text-2xl font-bold">Syllabus Manager - Coming Soon</h1></div>;
const Analytics = () => <div className="p-8"><h1 className="text-2xl font-bold">Mock Test Analytics - Coming Soon</h1></div>;
const Timetable = () => <div className="p-8"><h1 className="text-2xl font-bold">Timetable & Daily Plan - Coming Soon</h1></div>;
const Flashcards = () => <div className="p-8"><h1 className="text-2xl font-bold">Flashcards & Revision - Coming Soon</h1></div>;
const Calendar = () => <div className="p-8"><h1 className="text-2xl font-bold">Calendar & Goal Tracking - Coming Soon</h1></div>;
const Goals = () => <div className="p-8"><h1 className="text-2xl font-bold">Gamification & Goals - Coming Soon</h1></div>;

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
                  <Route path="/" element={<Dashboard />} />
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
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;