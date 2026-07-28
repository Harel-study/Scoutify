import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, MessageSquare, LogOut, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 15 seconds to simulate real-time updates
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notif: any) => {
    try {
      await api.put(`/notifications/${notif._id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setShowNotifications(false);
      
      // Navigate to correct link based on source
      if (notif.sourceLink) {
        navigate(notif.sourceLink);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-dark-200 dark:border-dark-800 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg tracking-wider shadow-lg shadow-brand-500/20">
                S
              </span>
              <span className="text-xl font-extrabold text-dark-900 dark:text-white tracking-tight">
                Scout<span className="text-brand-500">ify</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <>
                {/* Chat shortcut */}
                <button
                  onClick={() => navigate('/messages')}
                  className="p-2 text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {/* Notifications dropdown trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition duration-200 relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-dark-200 dark:border-dark-700 py-2 max-h-96 overflow-y-auto animate-fade-in">
                      <div className="px-4 py-2 border-b border-dark-100 dark:border-dark-700 flex justify-between items-center">
                        <span className="font-bold text-sm text-dark-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-brand-500 hover:underline flex items-center"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" /> Mark all read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-dark-400 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left px-4 py-3 border-b border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700/50 flex flex-col transition duration-200 ${
                              !notif.isRead ? 'bg-brand-50/50 dark:bg-brand-950/10' : ''
                            }`}
                          >
                            <span className="text-sm text-dark-800 dark:text-dark-200">{notif.content}</span>
                            <span className="text-[10px] text-dark-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
