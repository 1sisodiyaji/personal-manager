import React, { createContext, useContext, useState, useEffect } from 'react';

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

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [activeTheme, setActiveTheme] = useState('light');
    const [currentTheme, setCurrentTheme] = useState(themes.light);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setActiveTheme(savedTheme);
        setCurrentTheme(themes[savedTheme]);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const updateTheme = (themeName) => {
        setActiveTheme(themeName);
        setCurrentTheme(themes[themeName]);
        localStorage.setItem('theme', themeName);
        document.documentElement.classList.toggle('dark', themeName === 'dark');
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, activeTheme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 