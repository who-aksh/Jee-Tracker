import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import CompleteDashboard from './components/Dashboard/CompleteDashboard';
import SyllabusManager from './components/SyllabusManager/SyllabusManager';
import Analytics from './components/Analytics/Analytics';
import Timetable from './components/Timetable/Timetable';
import Flashcards from './components/Flashcards/Flashcards';
import CalendarGoals from './components/Calendar/CalendarGoals';
import Gamification from './components/Gamification/Gamification';

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
                  <Route path="/" element={<CompleteDashboard />} />
                  <Route path="/syllabus" element={<SyllabusManager />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/timetable" element={<Timetable />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                  <Route path="/calendar" element={<CalendarGoals />} />
                  <Route path="/goals" element={<Gamification />} />
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