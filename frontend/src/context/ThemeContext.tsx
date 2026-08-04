/**
 * @module ThemeContext
 *
 * Manages the application's visual theme state (light/dark mode).
 * Persists the user's preference to local storage and applies the necessary
 * CSS classes to the document root.
 */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  /** @type {Theme} The currently active visual theme. */
  theme: Theme;
  /**
   * Toggles the active theme between light and dark modes.
   */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides theme state and controls to the component tree.
 *
 * Initializes the theme based on local storage or system preference.
 * Automatically synchronizes the theme state with the DOM document element.
 *
 * @param  {object}           props           The component props.
 * @param  {React.ReactNode}  props.children  The child components.
 * @returns {React.ReactElement} The Theme Provider element.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme context.
 *
 * Must be used within a ThemeProvider component tree.
 *
 * @returns {ThemeContextType} The current theme context values.
 * @throws  {Error} If called outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
