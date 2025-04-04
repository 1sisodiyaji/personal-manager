import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import {
    Palette,
    Bell,
    User,
    Save,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

const Settings = () => {
    const { currentTheme, activeTheme, updateTheme } = useTheme();
    const [settings, setSettings] = useState({
        theme: activeTheme,
        notifications: {
            email: true,
            push: true,
            taskReminders: true,
            eventReminders: true,
            noteUpdates: true
        },
        profile: {
            name: '',
            email: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};
        if (settings.profile.email && !validateEmail(settings.profile.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (settings.profile.name && settings.profile.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchSettings = async () => {
        try {
            console.log('Fetching settings...');
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/settings`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Settings response:', response.data);

            if (response.data) {
                setSettings(prev => ({
                    ...prev,
                    ...response.data
                }));
                // Update theme if it exists in response
                if (response.data.theme) {
                    updateTheme(response.data.theme);
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setSaveStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to load settings. Please try again.'
            });
            setIsLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!validateForm()) {
            setSaveStatus({
                type: 'error',
                message: 'Please fix the errors before saving.'
            });
            return;
        }

        setIsSaving(true);
        try {
            console.log('Saving settings:', settings);
            const response = await axios.put(
                `${import.meta.env.VITE_APP_BACKEND_URL}/api/settings`,
                settings,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log('Save response:', response.data);

            // Update theme in context
            if (settings.theme) {
                updateTheme(settings.theme);
            }

            setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to save settings'
            });
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleThemeChange = (theme) => {
        console.log('Theme changed to:', theme);
        setSettings(prev => ({ ...prev, theme }));
        // Update theme immediately in context
        updateTheme(theme);
    };

    const handleNotificationToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handleProfileChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [key]: value
            }
        }));
        // Clear error when user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: null }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: currentTheme.primary }} />
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ color: currentTheme.text }}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: currentTheme.text }}>Settings</h2>
                <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                    style={{
                        backgroundColor: currentTheme.primary,
                        color: '#FFFFFF',
                        opacity: isSaving ? 0.7 : 1
                    }}
                >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {saveStatus && (
                <div className="p-4 rounded-lg flex items-center space-x-2" style={{
                    backgroundColor: saveStatus.type === 'success' ? `${currentTheme.success}20` : `${currentTheme.error}20`,
                    color: saveStatus.type === 'success' ? currentTheme.success : currentTheme.error
                }}>
                    {saveStatus.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    <span>{saveStatus.message}</span>
                </div>
            )}

            {/* Theme Settings */}
            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: currentTheme.surface }}>
                <div className="flex items-center space-x-2 mb-4">
                    <Palette className="w-5 h-5" style={{ color: currentTheme.textSecondary }} />
                    <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Theme</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['light', 'dark', 'blue', 'green', 'purple', 'orange', 'rose'].map(theme => (
                        <button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            className="p-4 rounded-lg border-2 transition-colors"
                            style={{
                                borderColor: settings.theme === theme ? currentTheme.primary : currentTheme.border,
                                backgroundColor: settings.theme === theme ? `${currentTheme.primary}10` : 'transparent'
                            }}
                        >
                            <div className="h-20 rounded-md mb-2" style={{
                                backgroundColor: theme === 'light' ? '#FFFFFF' :
                                    theme === 'dark' ? '#1F2937' :
                                        theme === 'blue' ? '#3B82F6' :
                                            theme === 'green' ? '#10B981' :
                                                theme === 'purple' ? '#8B5CF6' :
                                                    theme === 'orange' ? '#F59E0B' :
                                                        '#F43F5E'
                            }} />
                            <span className="text-sm font-medium capitalize" style={{ color: currentTheme.text }}>
                                {theme}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification Settings */}
            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: currentTheme.surface }}>
                <div className="flex items-center space-x-2 mb-4">
                    <Bell className="w-5 h-5" style={{ color: currentTheme.textSecondary }} />
                    <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Notifications</h3>
                </div>
                <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium capitalize" style={{ color: currentTheme.text }}>
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                                    {key === 'email' && 'Receive notifications via email'}
                                    {key === 'push' && 'Receive push notifications'}
                                    {key === 'taskReminders' && 'Get reminded about upcoming tasks'}
                                    {key === 'eventReminders' && 'Get reminded about upcoming events'}
                                    {key === 'noteUpdates' && 'Get notified when notes are updated'}
                                </p>
                            </div>
                            <button
                                onClick={() => handleNotificationToggle(key)}
                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                                style={{
                                    backgroundColor: value ? currentTheme.primary : currentTheme.border
                                }}
                            >
                                <span
                                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                    style={{
                                        transform: value ? 'translateX(1.25rem)' : 'translateX(0.25rem)'
                                    }}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile Settings */}
            <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: currentTheme.surface }}>
                <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5" style={{ color: currentTheme.textSecondary }} />
                    <h3 className="text-lg font-semibold" style={{ color: currentTheme.text }}>Profile</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium" style={{ color: currentTheme.text }}>
                            Name
                        </label>
                        <input
                            type="text"
                            value={settings.profile.name}
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            className="mt-1 block w-full rounded-md shadow-sm"
                            style={{
                                backgroundColor: currentTheme.background,
                                borderColor: errors.name ? currentTheme.error : currentTheme.border,
                                color: currentTheme.text
                            }}
                        />
                        {errors.name && (
                            <div className="mt-1 flex items-center text-sm" style={{ color: currentTheme.error }}>
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium" style={{ color: currentTheme.text }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="mt-1 block w-full rounded-md shadow-sm"
                            style={{
                                backgroundColor: currentTheme.background,
                                borderColor: errors.email ? currentTheme.error : currentTheme.border,
                                color: currentTheme.text
                            }}
                        />
                        {errors.email && (
                            <div className="mt-1 flex items-center text-sm" style={{ color: currentTheme.error }}>
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.email}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium" style={{ color: currentTheme.text }}>
                            Timezone
                        </label>
                        <select
                            value={settings.profile.timezone}
                            onChange={(e) => handleProfileChange('timezone', e.target.value)}
                            className="mt-1 block w-full rounded-md shadow-sm"
                            style={{
                                backgroundColor: currentTheme.background,
                                borderColor: currentTheme.border,
                                color: currentTheme.text
                            }}
                        >
                            {Intl.supportedValuesOf('timeZone').map((zone) => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 