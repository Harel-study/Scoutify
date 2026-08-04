/**
 * @module ErrorBoundary
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the application.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** @type {ReactNode | undefined} The child components to be rendered and monitored for errors. */
  children?: ReactNode;
}

interface State {
  /** @type {boolean} True if an error has been caught in the child component tree. */
  hasError: boolean;
  /** @type {Error | null} The caught error object, or null if no error has occurred. */
  error: Error | null;
}

/**
 * Represents a React Error Boundary component.
 *
 * Wraps around other components to catch rendering errors, preventing the
 * entire application from unmounting. Provides a user-friendly fallback
 * interface with a recovery option (page refresh).
 *
 * @class
 * @extends {Component}
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  /**
   * Updates state so the next render will show the fallback UI.
   *
   * @param  {Error}  error  The error that was thrown by a child component.
   * @returns {State}  The new state indicating an error occurred.
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Logs error information to the console for debugging purposes.
   *
   * @param  {Error}      error      The error that was thrown.
   * @param  {ErrorInfo}  errorInfo  Additional information about the error, such as the component stack.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React render tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-dark-900 text-slate-100 p-6">
          <div className="bg-dark-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-dark-700 text-center">
            <div className="w-16 h-16 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-dark-400 text-sm mb-6">
              The application encountered an unexpected error. Please refresh the page or contact support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-brand-500/20"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;  }
}

export default ErrorBoundary;
