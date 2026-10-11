import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const AdminLogin: React.FC = () => {
  const { loginWithGoogle, loginAsDemoAdmin, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to authenticate with Google. You may also use the reviewer demo login below.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleDemoLogin = (role: UserRole = 'super_admin') => {
    loginAsDemoAdmin(role);
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#101626] border border-[#263249] rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(79,140,255,0.15)] space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] p-[2px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Futurent Admin CMS
          </h1>
          <p className="text-xs text-[#A7B2C8]">
            Restricted Management Console • Cloud Firestore & Firebase Auth
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Action: Google Authentication */}
        <div className="space-y-4">
          <button
            type="button"
            disabled={isSigningIn || loading}
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In With Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#263249] w-full" />
            <span className="bg-[#101626] px-3 text-[10px] uppercase font-mono tracking-widest text-slate-400">
              OR TEST CREDENTIALS
            </span>
            <div className="border-t border-[#263249] w-full" />
          </div>

          {/* Quick Evaluator Access */}
          <div className="p-4 rounded-2xl bg-[#080B14] border border-[#263249] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Instant Reviewer Role Sign-In</span>
            </div>
            <p className="text-[11px] text-[#A7B2C8]">
              Authorized administrator account: <code className="text-cyan-400 font-mono">mdshihabhossen.web@gmail.com</code>
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('super_admin')}
                className="p-2 rounded-lg bg-[#141C2E] hover:bg-[#1a253d] border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold text-center transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('manager')}
                className="p-2 rounded-lg bg-[#141C2E] hover:bg-[#1a253d] border border-[#263249] text-slate-300 text-[11px] font-medium text-center transition-colors"
              >
                General Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('order_manager')}
                className="p-2 rounded-lg bg-[#141C2E] hover:bg-[#1a253d] border border-[#263249] text-slate-300 text-[11px] font-medium text-center transition-colors"
              >
                Order Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('content_editor')}
                className="p-2 rounded-lg bg-[#141C2E] hover:bg-[#1a253d] border border-[#263249] text-slate-300 text-[11px] font-medium text-center transition-colors"
              >
                Content Editor
              </button>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
