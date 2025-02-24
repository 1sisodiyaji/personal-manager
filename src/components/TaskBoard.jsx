import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, Reorder } from 'framer-motion';
import axios from 'axios';
import { X, Edit2, Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

const TaskColumn = ({ columnId, tasks, setTasks, allTasks, handleEdit, handleDelete, handleDragEnd }) => {
  const getCardStyle = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-orange-100 border-l-4 border-orange-500';
      case 'doing':
        return 'bg-gray-100 border-l-4 border-gray-500';
      case 'completed':
        return 'bg-green-100 border-l-4 border-green-500';
      default:
        return 'bg-white border-l-4 border-gray-300';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="min-h-[200px] p-4 rounded-lg bg-gray-50" data-column-id={columnId}>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragEnd={(event, info) => {
              const elements = document.elementsFromPoint(event.clientX, event.clientY);
              const dropTarget = elements.find(el => 
                el.getAttribute('data-column-id')
              );
              
              if (dropTarget) {
                const newStatus = dropTarget.getAttribute('data-column-id');
                if (newStatus && newStatus !== columnId) {
                  handleDragEnd(task._id, columnId, newStatus);
                }
              }
            }}
            className={`p-4 rounded-lg shadow mb-3 cursor-move relative group ${getCardStyle(columnId)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mt-2">{task.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  <p>Created: {formatDate(task.createdAt)}</p>
                  {task.startedAt && <p>Started: {formatDate(task.startedAt)}</p>}
                  {task.completedAt && <p>Completed: {formatDate(task.completedAt)}</p>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(task);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task._id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState({ todo: [], doing: [], completed: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`);
      const tasksByStatus = {
        todo: response.data.filter(task => task.status === 'todo'),
        doing: response.data.filter(task => task.status === 'doing'),
        completed: response.data.filter(task => task.status === 'completed')
      };
      setTasks(tasksByStatus);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (taskId, sourceStatus, destinationStatus) => {
    if (sourceStatus === destinationStatus) return;

    try {
      // Update task status in the backend
      const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}/status`, {
        status: destinationStatus
      });

      // Update local state
      const newTasks = { ...tasks };
      const task = response.data;
      
      // Remove from source
      newTasks[sourceStatus] = newTasks[sourceStatus].filter(t => t._id !== taskId);
      
      // Add to destination
      newTasks[destinationStatus] = [...newTasks[destinationStatus], task];
      
      setTasks(newTasks);
      toast.success('Task moved successfully');
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Failed to move task');
    }
  };

  const exportToExcel = () => {
    const allTasks = [...tasks.todo, ...tasks.doing, ...tasks.completed];
    const exportData = allTasks.map(task => ({
      'Title': task.title,
      'Description': task.description,
      'Status': task.status,
      'Created Date': format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm'),
      'Started Date': task.startedAt ? format(new Date(task.startedAt), 'yyyy-MM-dd HH:mm') : '-',
      'Completed Date': task.completedAt ? format(new Date(task.completedAt), 'yyyy-MM-dd HH:mm') : '-',
      'Time to Start': task.startedAt ? 
        `${Math.round((new Date(task.startedAt) - new Date(task.createdAt)) / (1000 * 60))} minutes` : '-',
      'Time to Complete': task.completedAt && task.startedAt ? 
        `${Math.round((new Date(task.completedAt) - new Date(task.startedAt)) / (1000 * 60))} minutes` : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

    const fileName = `tasks_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success('Tasks exported successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`, {
        ...newTask,
        status: 'todo'
      });
      
      setTasks(prev => ({
        ...prev,
        todo: [...prev.todo, response.data]
      }));
      
      setNewTask({ title: '', description: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsSubmitting(true);
      try {
        await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}`);
        
        const newTasks = { ...tasks };
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(task => task._id !== taskId);
        });
        setTasks(newTasks);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${editedTask._id}`, {
        title: editedTask.title,
        description: editedTask.description,
      });
      
      const newTasks = { ...tasks };
      Object.keys(newTasks).forEach(status => {
        const index = newTasks[status].findIndex(task => task._id === editedTask._id);
        if (index !== -1) {
          newTasks[status][index] = { ...newTasks[status][index], ...response.data };
        }
      });
      setTasks(newTasks);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Task Board</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Download size={16} />
            Export Tasks
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([status, columnTasks]) => (
            <div key={status} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {status} ({columnTasks.length})
              </h3>
              <TaskColumn
                columnId={status}
                tasks={columnTasks}
                setTasks={setTasks}
                allTasks={tasks}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
