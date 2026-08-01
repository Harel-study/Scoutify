import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (message?: string, subtext?: string, delay?: number, minDuration?: number) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('טוען נתונים...');
  const [subtext, setSubtext] = useState<string | undefined>('אנא המתן רגע, המערכת מכינה את התוכן');
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

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
