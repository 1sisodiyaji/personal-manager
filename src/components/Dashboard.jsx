import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
    CheckSquare,
    StickyNote,
    Calendar,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const Dashboard = () => {
    const { currentTheme } = useTheme();
    const [stats, setStats] = useState({
        tasks: { total: 0, completed: 0, pending: 0 },
        notes: { total: 0, pinned: 0 },
        events: { total: 0, upcoming: 0 }
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch tasks
            const tasksResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/tasks`);
            const tasks = tasksResponse.data;
            setStats(prev => ({
                ...prev,
                tasks: {
                    total: tasks.length,
                    completed: tasks.filter(t => t.status === 'completed').length,
                    pending: tasks.filter(t => t.status !== 'completed').length
                }
            }));
            setRecentTasks(tasks.slice(0, 5));

            // Fetch notes
            const notesResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/notes`);
            const notes = notesResponse.data;
            setStats(prev => ({
                ...prev,
                notes: {
                    total: notes.length,
                    pinned: notes.filter(n => n.isPinned).length
                }
            }));
            setRecentNotes(notes.slice(0, 5));

            // Fetch events
            const eventsResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events`);
            const events = eventsResponse.data;
            const now = new Date();
            const upcoming = events.filter(e => new Date(e.date) > now);
            setStats(prev => ({
                ...prev,
                events: {
                    total: events.length,
                    upcoming: upcoming.length
                }
            }));
            setUpcomingEvents(upcoming.slice(0, 5));

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: currentTheme.primary }} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold" style={{ color: currentTheme.text }}>Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tasks Stats */}
                <div className="p-6 rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.surface }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Tasks</h3>
                        <CheckSquare className="w-6 h-6" style={{ color: currentTheme.primary }} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Total Tasks</span>
                            <span style={{ color: currentTheme.text }}>{stats.tasks.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Completed</span>
                            <span style={{ color: currentTheme.success }}>{stats.tasks.completed}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Pending</span>
                            <span style={{ color: currentTheme.warning }}>{stats.tasks.pending}</span>
                        </div>
                    </div>
                </div>

                {/* Notes Stats */}
                <div className="p-6 rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.surface }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Notes</h3>
                        <StickyNote className="w-6 h-6" style={{ color: currentTheme.primary }} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Total Notes</span>
                            <span style={{ color: currentTheme.text }}>{stats.notes.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Pinned</span>
                            <span style={{ color: currentTheme.warning }}>{stats.notes.pinned}</span>
                        </div>
                    </div>
                </div>

                {/* Events Stats */}
                <div className="p-6 rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.surface }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Events</h3>
                        <Calendar className="w-6 h-6" style={{ color: currentTheme.primary }} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Total Events</span>
                            <span style={{ color: currentTheme.text }}>{stats.events.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span style={{ color: currentTheme.textSecondary }}>Upcoming</span>
                            <span style={{ color: currentTheme.info }}>{stats.events.upcoming}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <div className="p-6 rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.surface }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Recent Tasks</h3>
                    <div className="space-y-4">
                        {recentTasks.map(task => (
                            <div key={task._id} className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5" style={{ color: currentTheme.success }} />
                                <span style={{ color: currentTheme.text }}>{task.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Notes */}
                <div className="p-6 rounded-lg shadow-sm"
                    style={{ backgroundColor: currentTheme.surface }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Recent Notes</h3>
                    <div className="space-y-4">
                        {recentNotes.map(note => (
                            <div key={note._id} className="flex items-center space-x-3">
                                <StickyNote className="w-5 h-5" style={{ color: currentTheme.primary }} />
                                <span style={{ color: currentTheme.text }}>{note.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="p-6 rounded-lg shadow-sm"
                style={{ backgroundColor: currentTheme.surface }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.text }}>Upcoming Events</h3>
                <div className="space-y-4">
                    {upcomingEvents.map(event => (
                        <div key={event._id} className="flex items-center space-x-3">
                            <Clock className="w-5 h-5" style={{ color: currentTheme.info }} />
                            <span style={{ color: currentTheme.text }}>{event.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 