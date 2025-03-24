import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    CheckSquare,
    StickyNote,
    Calendar,
    Settings,
    Menu,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();
    const { currentTheme } = useTheme();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/notes', label: 'Notes', icon: StickyNote },
        { path: '/schedule', label: 'Schedule', icon: Calendar },
        { path: '/settings', label: 'Settings', icon: Settings }
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={onToggle}
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800  md:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <div className="flex flex-col h-full" style={{ backgroundColor: currentTheme.surface }}>

                    {/* Navigation */}
                    <nav className="flex-1 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center px-4 py-3 mb-1 transition-colors"
                                    style={{
                                        backgroundColor: isActive ? `${currentTheme.primary}20` : 'transparent',
                                        color: isActive ? currentTheme.primary : currentTheme.text
                                    }}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t" style={{ borderColor: currentTheme.border }}>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full mr-3"
                                style={{ backgroundColor: currentTheme.primary }} />
                            <div>
                                <p className="text-sm font-medium" style={{ color: currentTheme.text }}>Golu Singh</p>
                                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>golukumar.singh@visnet.in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
};

export default Sidebar; 