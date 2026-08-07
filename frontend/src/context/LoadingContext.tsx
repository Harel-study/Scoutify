/**
 * @module LoadingContext
 *
 * Manages global loading state and provides functions to show or hide a
 * centralized loading screen overlay across the application.
 */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextType {
  /** @type {boolean} True if the global loading overlay is currently active. */
  isLoading: boolean;
  /**
   * Activates the loading overlay with optional custom messaging and timing.
   *
   * @param  {string}  [message]      Primary loading message.
   * @param  {string}  [subtext]      Secondary description text.
   * @param  {number}  [delay]        Delay in ms before showing the overlay (default: 100).
   * @param  {number}  [minDuration]  Minimum duration in ms the overlay remains visible (default: 900).
   */
  showLoading: (message?: string, subtext?: string, delay?: number, minDuration?: number) => void;
  /**
   * Deactivates the global loading overlay.
   */
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Provides global loading state and controls to the component tree.
 *
 * Wraps its children and rendering the centralized LoadingScreen component.
 *
 * @param  {object}           props           The component props.
 * @param  {React.ReactNode}  props.children  The child components.
 * @returns {React.ReactElement} The Loading Provider element.
 */
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Loading data...');
  const [subtext, setSubtext] = useState<string | undefined>('Please wait a moment while the content is prepared');
  const [delay, setDelay] = useState<number>(100);
  const [minDuration, setMinDuration] = useState<number>(900);

  const showLoading = useCallback((
    msg?: string,
    sub?: string,
    customDelay: number = 100,
    customMinDuration: number = 900
  ) => {
    if (msg) setMessage(msg);
    if (sub !== undefined) setSubtext(sub);
    setDelay(customDelay);
    setMinDuration(customMinDuration);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      <LoadingScreen
        isVisible={isLoading}
        delay={delay}
        minDuration={minDuration}
        message={message}
        subtext={subtext}
      />
    </LoadingContext.Provider>
  );
};

/**
 * Hook to access the global loading context.
 *
 * Must be used within a LoadingProvider component tree.
 *
 * @returns {LoadingContextType} The current loading context values and control functions.
 * @throws  {Error} If called outside of a LoadingProvider.
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
