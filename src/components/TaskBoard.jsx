import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import TaskCard from './tasks/TaskCard';
import TaskForm from './tasks/TaskForm';

const TaskBoard = () => {
  const { currentTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`);
      setTasks(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'todo'
    });
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${editingTask._id}`, taskForm);
        setTasks(prevTasks => prevTasks.map(task =>
          task._id === editingTask._id ? { ...task, ...taskForm } : task
        ));
      } else {
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`, taskForm);
        setTasks(prevTasks => [...prevTasks, response.data]);
      }
      setIsModalOpen(false);
      setTaskForm({ title: '', description: '', status: 'todo' });
      setError(null);
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (e, taskId, sourceStatus) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceStatus', sourceStatus);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceStatus = e.dataTransfer.getData('sourceStatus');

    if (sourceStatus === targetStatus) return;

    try {
      await axios.patch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks/${taskId}/status`, { status: targetStatus });
      setTasks(prevTasks => prevTasks.map(task =>
        task._id === taskId ? { ...task, status: targetStatus } : task
      ));
      setError(null);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  const getTasksByStatus = (status) => {
    return Array.isArray(tasks) ? tasks.filter(task => task.status === status) : [];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: currentTheme.primary }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: currentTheme.text }}>Task Board</h2>
        <button
          onClick={handleAddTask}
          className="flex items-center px-4 py-2 rounded-md transition-colors"
          style={{ backgroundColor: currentTheme.primary, color: '#FFFFFF' }}
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded relative" role="alert"
          style={{ backgroundColor: `${currentTheme.error}20`, borderColor: currentTheme.error, color: currentTheme.error }}>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div
          className="rounded-lg p-4 min-h-[400px]"
          style={{ backgroundColor: currentTheme.surface }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>To Do</h3>
          <div className="space-y-4">
            {getTasksByStatus('todo').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isSubmitting={isSubmitting}
                onDragStart={handleDragStart}
                currentTheme={currentTheme}
              />
            ))}
          </div>
        </div>

        {/* Doing Column */}
        <div
          className="rounded-lg p-4 min-h-[400px]"
          style={{ backgroundColor: currentTheme.surface }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'doing')}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Doing</h3>
          <div className="space-y-4">
            {getTasksByStatus('doing').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isSubmitting={isSubmitting}
                onDragStart={handleDragStart}
                currentTheme={currentTheme}
              />
            ))}
          </div>
        </div>

        {/* Completed Column */}
        <div
          className="rounded-lg p-4 min-h-[400px]"
          style={{ backgroundColor: currentTheme.surface }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'completed')}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Completed</h3>
          <div className="space-y-4">
            {getTasksByStatus('completed').map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isSubmitting={isSubmitting}
                onDragStart={handleDragStart}
                currentTheme={currentTheme}
              />
            ))}
          </div>
        </div>
      </div>

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        isSubmitting={isSubmitting}
        editingTask={editingTask}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default TaskBoard;
