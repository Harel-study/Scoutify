import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, UserPlus, Chrome, AlertCircle, Users } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, googleLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'player' | 'team' | 'staff'>('player');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleMock, setShowGoogleMock] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, password, role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async (mockUsername: string, selectedRole: 'player' | 'team' | 'staff') => {
    setError('');
    setLoading(true);
    try {
      const mockToken = `mock_${mockUsername}`;
      await googleLogin(mockToken, selectedRole);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Mock Google signup failed');
    } finally {
      setLoading(false);
      setShowGoogleMock(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-900 border border-dark-150 dark:border-dark-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center">
          <span className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl tracking-wider mx-auto shadow-lg shadow-brand-500/20">
            S
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
            Join the sports industry network.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-start space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
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
              <label htmlFor="password" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 text-sm rounded-2xl theme-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
                I am a
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-500">
                  <Users className="w-5 h-5" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="block w-full pl-11 pr-4 py-3 text-sm rounded-2xl theme-select appearance-none"
                >
                  <option value="player" className="bg-white dark:bg-dark-900 text-dark-900 dark:text-white">Athlete (Player)</option>
                  <option value="team" className="bg-white dark:bg-dark-900 text-dark-900 dark:text-white">Club / Sports Organization</option>
                  <option value="staff" className="bg-white dark:bg-dark-900 text-dark-900 dark:text-white">Staff (Coach, scout, physio)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20"
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? 'Creating Account...' : 'Sign up'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col space-y-4">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-dark-150 dark:border-dark-800"></div>
            <span className="flex-shrink mx-4 text-dark-500 text-xs font-semibold uppercase tracking-wider">Or register with</span>
            <div className="flex-grow border-t border-dark-150 dark:border-dark-800"></div>
          </div>

          {!showGoogleMock ? (
            <button
              onClick={() => setShowGoogleMock(true)}
              className="w-full border border-dark-200 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800 text-dark-900 dark:text-white font-medium py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2 active:scale-98"
            >
              <Chrome className="w-5 h-5 text-red-400" />
              <span>Register with Google</span>
            </button>
          ) : (
            <div className="bg-dark-50 dark:bg-dark-800 p-4 border border-dark-150 dark:border-dark-700 rounded-2xl space-y-3 animate-slide-up">
              <p className="text-xs font-bold text-dark-300 uppercase text-center mb-1">Simulate Google Registration as:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleMockGoogleLogin('googleplayer', 'player')}
                  className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 hover:border-brand-500 text-[11px] text-dark-900 dark:text-white py-2 rounded-xl transition duration-150 font-semibold"
                >
                  New Athlete
                </button>
                <button
                  onClick={() => handleMockGoogleLogin('googleteam', 'team')}
                  className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 hover:border-brand-500 text-[11px] text-dark-900 dark:text-white py-2 rounded-xl transition duration-150 font-semibold"
                >
                  New Club
                </button>
                <button
                  onClick={() => handleMockGoogleLogin('googlestaff', 'staff')}
                  className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 hover:border-brand-500 text-[11px] text-dark-900 dark:text-white py-2 rounded-xl transition duration-150 font-semibold"
                >
                  New Staff
                </button>
              </div>
              <button
                onClick={() => setShowGoogleMock(false)}
                className="w-full text-center text-xs text-dark-400 hover:underline pt-1 block"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-dark-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
