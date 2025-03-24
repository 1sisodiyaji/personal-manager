import React from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, isSubmitting, onDragStart, currentTheme }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'todo':
                return currentTheme.warning;
            case 'doing':
                return currentTheme.info;
            case 'completed':
                return currentTheme.success;
            default:
                return currentTheme.textSecondary;
        }
    };

    const formatDate = (date) => (date ? format(new Date(date), 'MMM dd, yyyy HH:mm') : '');

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task._id, task.status)}
            className="p-4 rounded-lg shadow-sm cursor-move"
            style={{ backgroundColor: currentTheme.surface }}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-medium mb-2" style={{ color: currentTheme.text }}>{task.title}</h4>
                    {task.description && (
                        <p className="text-sm mb-3" style={{ color: currentTheme.textSecondary }}>
                            {task.description}
                        </p>
                    )}
                    <div className="flex items-center space-x-2">
                        <span
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                                backgroundColor: `${getStatusColor(task.status)}20`,
                                color: getStatusColor(task.status)
                            }}
                        >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(task)}
                        disabled={isSubmitting}
                        className="p-1 rounded hover:bg-opacity-10 transition-colors"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        disabled={isSubmitting}
                        className="p-1 rounded hover:bg-opacity-10 transition-colors"
                        style={{ color: currentTheme.error }}
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        className="p-1 rounded hover:bg-opacity-10 transition-colors"
                        style={{ color: currentTheme.textSecondary }}
                    >
                        <MoreVertical size={16} />
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