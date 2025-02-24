import React, { useEffect, useState } from 'react';
import TaskBoard from './components/TaskBoard';
import NotesList from './components/NotesList';
import Summarizer from './components/Summarize';
import ConversationAnalyzer from './components/Rating';
import RoiCalculator from './components/RoiCalculator';
import { Menu, X, CheckSquare, StickyNote, FileText, MessageSquare, Calculator, AudioLines} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const App = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false); 
  };

  const menuItems = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { id: 'notes', label: 'Notes', icon: <StickyNote size={20} /> },
    { id: 'summarizer', label: 'Summarizer', icon: <FileText size={20} /> },
    { id: 'analyzer', label: 'Analyzer', icon: <MessageSquare size={20} /> },
    { id: 'roicalculator', label: 'ROI Calculator', icon: <Calculator size={20} /> },
  ];

  useEffect(() => {
    const startserver = async() => {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}`); 
      toast.success(response.data);
    }
    startserver();
  },[])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl text-sky-600 flex items-center gap-2"> Personal Manager <AudioLines className='text-sky-400 animate-pulse'/> </h1>
          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top bar with hamburger menu */}
        <div className="bg-white shadow-sm p-4 flex md:hidden items-center">
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="ml-4 text-lg font-semibold text-gray-800">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h2>
        </div>

        {/* Page Content */}
        <div className="p-6">
         
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Management</h2>
              <TaskBoard />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Notes</h2>
              <NotesList />
            </div>
          )}

          {activeTab === 'summarizer' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Summarizer</h2>
              <Summarizer />
            </div>
          )}

          {activeTab === 'analyzer' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Conversation Analyzer</h2>
              <ConversationAnalyzer />
            </div>
          )}

          {activeTab === 'roicalculator' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">ROI Calculator</h2>
              <RoiCalculator />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;