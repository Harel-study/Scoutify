import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Globe, Mail, Lock, CheckCircle, TrendingUp, Users, Award, ArrowRight, X, Sparkles, Shield } from 'lucide-react';

interface LoginPageProps {
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

export default function LoginPage({ onClose, onSwitchToSignUp }: LoginPageProps) {
  const [userType, setUserType] = useState<'player' | 'agent' | 'club'>('player');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1777529565014-2b0b39d0d250?w=1920",
    "https://images.unsplash.com/photo-1766525155813-e6375a0be54d?w=1920",
    "https://images.unsplash.com/flagged/photo-1550413231-202a9d53a331?w=1920",
    "https://images.unsplash.com/photo-1641280173256-0ac1b2f4cd78?w=1920"
  ];

  const floatingStats = [
    { value: "5,247", label: "Players", icon: Users, color: "bg-green-500" },
    { value: "850", label: "Agents", icon: Award, color: "bg-purple-500" },
    { value: "€2.8B", label: "Market Value", icon: TrendingUp, color: "bg-blue-500" },
    { value: "1,234", label: "Transfers", icon: CheckCircle, color: "bg-orange-500" },
  ];

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-purple-900/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Floating Stats Cards */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {floatingStats.map((stat, idx) => (
          <div
            key={idx}
            className="absolute animate-float"
            style={{
              top: `${15 + (idx * 20)}%`,
              left: idx % 2 === 0 ? '5%' : 'auto',
              right: idx % 2 === 1 ? '5%' : 'auto',
              animationDelay: `${idx * 0.5}s`,
              animationDuration: `${4 + idx}s`
            }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-blue-100">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <Globe className="w-7 h-7 text-blue-600" />
        </div>
        <span className="text-3xl font-bold text-white drop-shadow-lg">Scoutify</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-10 text-white hover:bg-white/20 rounded-full p-3 transition backdrop-blur-sm border border-white/20 shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Centered Login Card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full p-8 md:p-10 border border-white/50 animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Welcome to Scoutify</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your football network dashboard</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">I am a:</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setUserType('player')}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  userType === 'player'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-semibold">Player</p>
              </button>
              <button
                onClick={() => setUserType('agent')}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  userType === 'agent'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <Award className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-semibold">Agent</p>
              </button>
              <button
                onClick={() => setUserType('club')}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  userType === 'club'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-semibold">Club</p>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all transform hover:scale-105">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-semibold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all transform hover:scale-105">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-semibold">Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  onSwitchToSignUp?.();
                }}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-xs font-semibold">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-semibold">Verified</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-semibold">Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/80 text-sm font-medium drop-shadow-lg">
          Join 5,247 players, 850 agents, and 320 clubs worldwide
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
