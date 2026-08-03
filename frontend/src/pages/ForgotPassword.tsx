import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { forgotPassword } from '../services/authService';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('אנא הזן כתובת מייל תקינה');
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setSuccessMessage(res.message || 'אם כתובת המייל קיימת במערכת, נשלח אליה קישור לאיפוס סיסמה.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'אירעה שגיאה בחיבור לשרת. אנא נסה שוב מאוחר יותר.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200" dir="rtl">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-900 border border-dark-150 dark:border-dark-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/10">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            שכחת את הסיסמה?
          </h2>
          <p className="mt-2 text-sm text-dark-500 dark:text-dark-400">
            הזן את כתובת המייל שיצרת איתה חשבון ונשלח לך קישור לאיפוס הסיסמה.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start space-x-3 space-x-reverse text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-dark-900 dark:text-white">נשלחה הודעת איפוס</h3>
            <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
              {successMessage}
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-bold text-brand-500 hover:text-brand-600 space-x-1 space-x-reverse transition duration-150"
              >
                <span>חזרה למסך ההתחברות</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-xs font-bold text-dark-600 dark:text-dark-300 uppercase tracking-wider block mb-2">
                  כתובת אימייל
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-dark-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pr-11 pl-4 py-3 text-sm rounded-2xl theme-input focus:ring-2 focus:ring-brand-500 transition duration-150"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 active:scale-98 text-white font-semibold py-3.5 px-4 rounded-2xl transition duration-200 flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>שולח...</span>
                  </span>
                ) : (
                  <span>שלח קישור לאיפוס</span>
                )}
              </button>
            </div>
          </form>
        )}

        {!successMessage && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-dark-500 dark:text-dark-400 hover:text-brand-500 space-x-1 space-x-reverse transition duration-150"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה להתחברות</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
