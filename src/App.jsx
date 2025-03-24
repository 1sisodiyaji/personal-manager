import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import Notes from './components/NotesList';
import Schedule from './components/Schedule';
import Settings from './components/Settings';
import ThemeSelector from './components/ThemeSelector';
import { Menu, X } from 'lucide-react';

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentTheme } = useTheme();

  return (
    <div className="flex h-screen" style={{ backgroundColor: currentTheme.background }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ backgroundColor: currentTheme.surface, color: currentTheme.text }}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ backgroundColor: currentTheme.surface }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between border-b"
          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <h1 className="text-xl font-semibold" style={{ color: currentTheme.text }}>Personal Manager</h1>
          <ThemeSelector />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskBoard />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;