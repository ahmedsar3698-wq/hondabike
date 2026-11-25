import { useState, FormEvent } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

const ADMIN_EMAIL = 'Sardar678@gmail.com';
const ADMIN_PASS = 'ahmed66';
export const ADMIN_SESSION_STORAGE_KEY = 'honda_bike_pk_admin_session_v1';

interface AdminLoginGateProps {
  onSuccess: (email: string) => void;
}

export function AdminLoginGate({ onSuccess }: AdminLoginGateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Please enter both admin email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
        try {
          window.localStorage.setItem(
            ADMIN_SESSION_STORAGE_KEY,
            JSON.stringify({
              email: ADMIN_EMAIL,
              loggedInAt: new Date().toISOString(),
            })
          );
        } catch {
          // Proceed even if storage write fails
        }
        setIsSubmitting(false);
        onSuccess(ADMIN_EMAIL);
      } else {
        setIsSubmitting(false);
        setError('Invalid admin email or password. Please check your credentials.');
      }
    }, 150);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-[#131519] border border-[#222630] rounded-lg p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 pb-5 border-b border-[#1E212A]">
          <div className="w-10 h-10 rounded-md bg-[#2A1418] border border-[#D91B24]/40 flex items-center justify-center text-[#D91B24] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
              HONDA BIKE Showroom
            </p>
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              Admin Panel Sign In
            </h1>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-[#949BA8] leading-relaxed">
          Sign in with your authorized administrator email and password to manage motorcycles,
          official Atlas Honda PKR prices, and customer inquiries.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="p-3 bg-[#2A1418] border border-[#D91B24]/60 rounded-md text-xs text-[#FCA5A5]"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A909E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full h-11 pl-10 pr-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-[#C7CCD6] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A909E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-11 pl-10 pr-11 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A909E] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing In...' : 'Sign In to Admin Panel'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
