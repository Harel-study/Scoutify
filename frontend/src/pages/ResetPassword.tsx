/**
 * @module ResetPassword
 *
 * Renders the password reset page.
 * Allows users who have received a reset token via email to set a new password.
 */
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../services/authService';

/**
 * Renders the password reset form.
 *
 * Reads the reset token from the URL parameters, validates the new password input,
 * and submits the update to the authentication service.
 *
 * @returns {React.ReactElement} The ResetPassword component.
 */
export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Submits the new password form.
   *
   * Validates the token presence, password length, and password confirmation match.
   * On success, displays a success message and redirects to the login page after a delay.
   *
   * @param {React.FormEvent} e  The form submission event.
   * @returns {Promise<void>} Resolves when the reset process completes.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Password reset link is invalid.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      // Auto navigate to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error resetting password. The link may have expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-900 border border-dark-150 dark:border-dark-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
            Enter a new, secure password for your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start space-x-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-dark-900 dark:text-white">Password Updated Successfully!</h3>
            <p className="text-sm text-dark-600 dark:text-dark-300">
              You can now sign in with your new password. Redirecting to sign in page...
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-4 rounded-2xl transition duration-150"
              >
                Sign in now
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 text-sm rounded-2xl theme-input focus:ring-2 focus:ring-brand-500 transition duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 text-sm rounded-2xl theme-input focus:ring-2 focus:ring-brand-500 transition duration-150"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold py-3.5 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating password...</span>
                  </span>
                ) : (
                  <span>Update password</span>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-semibold text-dark-500 dark:text-dark-400 hover:text-brand-500 transition duration-150"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
