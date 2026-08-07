/**
 * @module App
 *
 * Root component that initializes the application and configures the main routing layout.
 * Integrates global providers for Redux state, authentication, theming, and error handling.
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
import { SocketProvider } from './context/SocketContext';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';


// Lazy load pages for code splitting & performance
const Feed = lazy(() => import('./pages/Feed'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Scouting = lazy(() => import('./pages/Scouting'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Displays a full-page loading screen with a consistent message.
 *
 * Used as a fallback component for React.Suspense when lazy loading routes
 * to ensure a smooth transition and visual feedback while chunks are fetched.
 *
 * @returns {React.ReactElement} The loading screen UI.
 */
const PageLoader: React.FC = () => (
  <LoadingScreen message="Loading page..." subtext="Fetching data for Scoutify..." />
);

/**
 * Wraps authenticated pages in a standardized dashboard layout.
 *
 * Provides the global navigation bar, sidebar, and main content area container.
 * Enforces consistent styling, responsiveness, and dark mode support across secure routes.
 *
 * @param {Object} props Component properties.
 * @param {React.ReactNode} props.children The inner page content to render.
 * @returns {React.ReactElement} The structured layout component.
 */
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

/**
 * The root React application component.
 *
 * Bootstraps the application state context providers (Error Boundary, Redux,
 * Theme, Auth, Loading) and configures the React Router structure. It defines
 * public authentication pages and secure, protected routes wrapped in the authenticated layout.
 *
 * @returns {React.ReactElement} The completely configured application tree.
 */
export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <LoadingProvider>
                <BrowserRouter>
              <Routes>
                {/* Public Authentication Pages */}
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Login />
                    </Suspense>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Register />
                    </Suspense>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ForgotPassword />
                    </Suspense>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />

                {/* Secure / Authenticated Dashboard Layout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Feed />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Jobs />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scout"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Scouting />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Messages />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Profile />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Dynamic Profile Route for viewing other users' profiles */}
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout>
                        <Profile />
                      </AuthenticatedLayout>
                    </ProtectedRoute>
                  }
                />
                {/* Catch-all 404 Not Found Route */}
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Routes>
              </BrowserRouter>
            </LoadingProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);
};

export default App;
