import React, { useEffect, useState } from 'react';
import TaskBoard from './components/TaskBoard';
import NotesList from './components/NotesList';
import Summarizer from './components/Summarize';
import ConversationAnalyzer from './components/Rating';
import RoiCalculator from './components/RoiCalculator';
import {CheckSquare, StickyNote, FileText, MessageSquare, Calculator, AudioLines} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const App = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false); 
    window.scrollTo({top: 0 ,behavior: 'smooth'});
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

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl text-sky-600 flex items-center gap-2"> Personal Manager <AudioLines className='text-sky-400 animate-pulse'/> </h1>
          
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
 
      <div className="flex-1">  
        <div className="md:p-6">
         
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-lg shadow-lg md:p-6 p-2">
              <h2 className="md:text-xl text-lg font-semibold mb-4 text-gray-800">Task Management</h2>
              <TaskBoard />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="bg-white rounded-lg shadow-lg md:p-6 p-2">
              <h2 className="md:text-xl text-lg font-semibold mb-4 text-gray-800">Notes</h2>
              <NotesList />
            </div>
          )}

          {activeTab === 'summarizer' && (
            <div className="bg-white rounded-lg shadow-lg md:p-6 p-2">
              <h2 className="md:text-xl text-lg font-semibold mb-4 text-gray-800">Summarizer</h2>
              <Summarizer />
            </div>
          )}

          {activeTab === 'analyzer' && (
            <div className="bg-white rounded-lg shadow-lg md:p-6 p-2">
              <h2 className="md:text-xl text-lg font-semibold mb-4 text-gray-800">Conversation Analyzer</h2>
              <ConversationAnalyzer />
            </div>
          )}

          {activeTab === 'roicalculator' && (
            <div className="bg-white rounded-lg shadow-lg md:p-6 p-2">
              <h2 className="md:text-xl text-lg font-semibold mb-4 text-gray-800">ROI Calculator</h2>
              <RoiCalculator />
            </div>
          )}

        </div>
      </div>

      <footer className="md:hidden fixed bottom-0  left-0 w-full bg-white shadow-md">
        <nav className="flex justify-around p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex flex-col items-center text-xs transition-colors ${
                activeTab === item.id ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}

export default App;