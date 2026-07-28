import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rss, Briefcase, Search, MessageSquare, User as UserIcon } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { to: '/', label: 'Feed', icon: Rss, id: 'feed-link' },
    { to: '/jobs', label: 'Job Board', icon: Briefcase, id: 'job-board-link' },
    { to: '/scout', label: 'Scouting Hub', icon: Search, id: 'scouting-link' },
    { to: '/messages', label: 'Direct Messages', icon: MessageSquare, id: 'messages-link' },
    { to: '/profile', label: 'My Profile', icon: UserIcon, id: 'profile-link' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-dark-800 border-r border-dark-200 dark:border-dark-700 h-auto md:h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 transition-colors duration-200">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              id={link.id}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700/60 hover:text-dark-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-dark-150 dark:border-dark-700">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm uppercase">
            {user.role[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-dark-800 dark:text-dark-200 truncate">
              {user.username || user.email}
            </p>
            <p className="text-[10px] font-medium text-brand-500 capitalize">
              {user.role} Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
