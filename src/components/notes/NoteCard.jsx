import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NoteCard = ({ note, onEdit, onDelete, isSubmitting }) => {
    const { currentTheme } = useTheme();

    return (
        <div
            className="rounded-lg p-4 w-full hover:shadow-md transition-shadow border"
            style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
        >
            <div className="flex justify-between items-start">
                <h3
                    className="font-medium"
                    style={{ color: currentTheme.text }}
                >
                    {note.title}
                </h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(note)}
                        className="transition-colors"
                        style={{
                            color: currentTheme.textSecondary,
                            opacity: isSubmitting ? 0.5 : 1
                        }}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.color = currentTheme.primary)}
                        onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.color = currentTheme.textSecondary)}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(note._id)}
                        className="transition-colors"
                        style={{
                            color: currentTheme.textSecondary,
                            opacity: isSubmitting ? 0.5 : 1
                        }}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.color = currentTheme.error)}
                        onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.color = currentTheme.textSecondary)}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            <p
                className="md:text-sm text-xs mt-2 text-balance"
                style={{ color: currentTheme.textSecondary }}
            >
                {note.content}
            </p>
        </div>
    );
};

export default NoteCard; 