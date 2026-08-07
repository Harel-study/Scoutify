import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';
import {
  GoogleLogin,
  type CredentialResponse,
} from '@react-oauth/google';

export const Login: React.FC = () => {
  const { login, googleLogin } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    setError('');

    const credential = credentialResponse.credential;

    if (!credential) {
      setError('Google did not return a valid credential');
      return;
    }

    setLoading(true);

    try {
      const result = await googleLogin(credential);

      if (result.needsRoleSelection) {
        const selectedRole = prompt(
          'Please enter role to register ("player", "team", "staff"):'
        );

        if (
          selectedRole !== 'player' &&
          selectedRole !== 'team' &&
          selectedRole !== 'staff'
        ) {
          setError(
            'Google registration cancelled: a valid role is required'
          );
          return;
        }

        await googleLogin(credential, selectedRole);
      }

      navigate('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google login failed';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (): void => {
    setError('Google sign in failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />

      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-900 border border-dark-150 dark:border-dark-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center">
          <span className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl tracking-wider mx-auto shadow-lg shadow-brand-500/20">
            S
          </span>

          <h2 className="mt-6 text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
            Connect directly with scouts, teams, and talent.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2"
              >
                Username
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-500">
                  <User className="w-5 h-5" />
                </div>

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 text-sm rounded-2xl theme-input"
                  placeholder="e.g. striker"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-500">
                  <Lock className="w-5 h-5" />
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 text-sm rounded-2xl theme-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 disabled:opacity-60"
          >
            <LogIn className="w-5 h-5" />

            <span>
              {loading ? 'Signing in...' : 'Sign in'}
            </span>
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-4">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-dark-150 dark:border-dark-800" />

            <span className="flex-shrink mx-4 text-dark-500 text-xs font-semibold uppercase tracking-wider">
              Or continue with
            </span>

            <div className="flex-grow border-t border-dark-150 dark:border-dark-800" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-dark-400">
            Don&apos;t have an account?{' '}

            <Link
              to="/register"
              className="text-brand-500 hover:underline font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;