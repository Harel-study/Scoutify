import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingProvider } from './context/LoadingContext';
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
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback for lazy components using new LoadingScreen
const PageLoader: React.FC = () => (
  <LoadingScreen message="טוען עמוד..." subtext="טוען נתונים למערכת Scoutify..." />
);

// Layout wrapper for authenticated pages
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

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
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
                // Dynamic Profile Route for viewing other users' profiles
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
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);
};

export default App;
