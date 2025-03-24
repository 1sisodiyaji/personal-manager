import React from 'react';
import { X } from 'lucide-react';

const NoteForm = ({ isOpen, onClose, onSubmit, noteForm, setNoteForm, isSubmitting, editingNote }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        {editingNote ? 'Edit Note' : 'Add New Note'}
                    </h3>
                    <X
                        onClick={onClose}
                        className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        disabled={isSubmitting}
                    />
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={noteForm.title}
                            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                            className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Content
                        </label>
                        <textarea
                            value={noteForm.content}
                            onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                            className="w-full p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            rows="4"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (editingNote ? 'Saving...' : 'Adding...')
                                : (editingNote ? 'Save' : 'Add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteForm; 