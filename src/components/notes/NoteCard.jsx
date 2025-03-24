import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete, isSubmitting }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full hover:shadow-md transition-shadow border dark:border-gray-700">
            <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800 dark:text-white">{note.title}</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(note)}
                        className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        disabled={isSubmitting}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(note._id)}
                        className="text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        disabled={isSubmitting}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 md:text-sm text-xs mt-2 text-balance">{note.content}</p>
        </div>
    );
};

export default NoteCard; 