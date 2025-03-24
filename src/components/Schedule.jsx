import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    Users,
    Trash2,
    Edit2,
    X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const Schedule = () => {
    const { currentTheme } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        location: '',
        attendees: '',
        reminder: 30
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events`);
            setEvents(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setIsLoading(false);
        }
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        try {
            if (selectedEvent) {
                await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events/${selectedEvent._id}`, eventForm);
            } else {
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events`, eventForm);
            }
            fetchEvents();
            setShowEventForm(false);
            setSelectedEvent(null);
            setEventForm({
                title: '',
                description: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                startTime: '',
                endTime: '',
                location: '',
                attendees: '',
                reminder: 30
            });
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/api/events/${eventId}`);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setEventForm({
            title: event.title,
            description: event.description,
            date: format(new Date(event.date), 'yyyy-MM-dd'),
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            attendees: event.attendees,
            reminder: event.reminder
        });
        setShowEventForm(true);
    };

    const getEventsForDate = (date) => {
        return events.filter(event => isSameDay(new Date(event.date), date));
    };

    const calendarDays = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Schedule</h2>
                <button
                    onClick={() => setShowEventForm(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                </button>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div
                            key={day}
                            className="bg-white dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                    {calendarDays.map((day, index) => {
                        const dayEvents = getEventsForDate(day);
                        return (
                            <div
                                key={day.toString()}
                                className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 ${!isSameMonth(day, currentDate) ? 'bg-gray-50 dark:bg-gray-900' : ''
                                    }`}
                            >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {format(day, 'd')}
                                </div>
                                <div className="mt-1 space-y-1">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event._id}
                                            className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                            onClick={() => handleEditEvent(event)}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {selectedEvent ? 'Edit Event' : 'Add Event'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEventForm(false);
                                    setSelectedEvent(null);
                                    setEventForm({
                                        title: '',
                                        description: '',
                                        date: format(new Date(), 'yyyy-MM-dd'),
                                        startTime: '',
                                        endTime: '',
                                        location: '',
                                        attendees: '',
                                        reminder: 30
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows="3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={eventForm.date}
                                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={eventForm.startTime}
                                        onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.location}
                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Attendees
                                </label>
                                <input
                                    type="text"
                                    value={eventForm.attendees}
                                    onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter email addresses separated by commas"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reminder (minutes before)
                                </label>
                                <input
                                    type="number"
                                    value={eventForm.reminder}
                                    onChange={(e) => setEventForm({ ...eventForm, reminder: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEventForm(false);
                                        setSelectedEvent(null);
                                        setEventForm({
                                            title: '',
                                            description: '',
                                            date: format(new Date(), 'yyyy-MM-dd'),
                                            startTime: '',
                                            endTime: '',
                                            location: '',
                                            attendees: '',
                                            reminder: 30
                                        });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {selectedEvent ? 'Update Event' : 'Add Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule; 