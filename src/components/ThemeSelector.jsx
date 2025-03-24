import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette } from 'lucide-react';

const themes = {
    light: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },
    dark: {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        background: '#1F2937',
        surface: '#374151',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB',
        border: '#4B5563',
        success: '#34D399',
        error: '#F87171',
        warning: '#FBBF24',
        info: '#60A5FA'
    },
    blue: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        background: '#EFF6FF',
        surface: '#DBEAFE',
        text: '#1E40AF',
        textSecondary: '#3B82F6',
        border: '#BFDBFE',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },
    green: {
        primary: '#10B981',
        secondary: '#34D399',
        background: '#ECFDF5',
        surface: '#D1FAE5',
        text: '#065F46',
        textSecondary: '#10B981',
        border: '#A7F3D0',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },
    purple: {
        primary: '#8B5CF6',
        secondary: '#A78BFA',
        background: '#F5F3FF',
        surface: '#EDE9FE',
        text: '#5B21B6',
        textSecondary: '#8B5CF6',
        border: '#DDD6FE',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },
    orange: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        background: '#FFFBEB',
        surface: '#FEF3C7',
        text: '#92400E',
        textSecondary: '#F59E0B',
        border: '#FDE68A',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    },
    rose: {
        primary: '#F43F5E',
        secondary: '#FB7185',
        background: '#FFF1F2',
        surface: '#FFE4E6',
        text: '#881337',
        textSecondary: '#F43F5E',
        border: '#FECDD3',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    }
};

const ThemeSelector = () => {
    const { currentTheme, activeTheme, updateTheme } = useTheme();

    return (
        <div className="relative group">
            <button
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                    backgroundColor: currentTheme.surface,
                    color: currentTheme.text
                }}
            >
                <Palette className="w-5 h-5" style={{ color: currentTheme.textSecondary }} />
                <span className="capitalize">{activeTheme}</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ backgroundColor: currentTheme.surface }}>
                <div className="py-1">
                    {Object.entries(themes).map(([themeName, themeColors]) => (
                        <button
                            key={themeName}
                            onClick={() => updateTheme(themeName)}
                            className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-opacity-10 transition-colors"
                            style={{
                                backgroundColor: activeTheme === themeName ? `${currentTheme.primary}20` : 'transparent',
                                color: currentTheme.text
                            }}
                        >
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: themeColors.primary }}
                            />
                            <span className="capitalize">{themeName}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector; 