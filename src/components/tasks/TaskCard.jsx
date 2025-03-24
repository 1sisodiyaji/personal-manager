import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, isSubmitting }) => {
    const getCardStyle = (status) => {
        switch (status) {
            case 'todo':
                return 'bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500';
            case 'doing':
                return 'bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-500';
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500';
            default:
                return 'bg-white dark:bg-gray-800 border-l-4 border-gray-300';
        }
    };

    const formatDate = (date) => (date ? format(new Date(date), 'MMM dd, yyyy HH:mm') : '');

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task._id);
                e.dataTransfer.setData('sourceStatus', task.status);
            }}
            className={`p-4 rounded-lg shadow-sm ${getCardStyle(task.status)} cursor-move`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        disabled={isSubmitting}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        disabled={isSubmitting}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {task.startedAt && <p>Started: {formatDate(task.startedAt)}</p>}
                {task.completedAt && <p>Completed: {formatDate(task.completedAt)}</p>}
            </div>
        </div>
    );
};

export default TaskCard; 