import React, { useState } from 'react';
import { portalStore, SECURE_PORTAL_ROUTES } from '../data/portalStore';
import {
  Calculator, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, KeyRound, ShieldAlert
} from 'lucide-react';

export default function AccountantLogin({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!securityPin || securityPin.trim().length !== 6) {
      setError('Please provide your 6-digit Financial Security PIN.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        portalStore.loginAccountant(username, password, securityPin);
        setIsLoading(false);
        onNavigate(SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Access Denied: Invalid Hotel Accountant credentials or Security PIN.');
      }
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#090105] text-gray-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Radial Luxury Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3a0214_0%,_#150209_55%,_#090105_100%)] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 arabesque-pattern opacity-10 pointer-events-none" />

      {/* Back to Guest Website Button */}
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-all"
      >
        <ArrowLeft size={14} className="text-[#d4af37]" />
        <span>Return to Guest Website</span>
      </button>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#16030c]/90 border border-[#d4af37]/45 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-6">
        {/* Header with Official Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden border-2 border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20 bg-[#120208]">
            <img
              src="/logo.jpg"
              alt="Arab Signature Hotel Monogram"
              className="w-full h-full object-cover scale-110"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#5c0725]/60 border border-[#d4af37]/30 text-[#f3e5ab] text-[10px] font-mono tracking-widest uppercase mb-1">
              <Calculator size={11} className="text-[#d4af37]" />
              <span>Confidential Financial Vault Gate</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              Chief Accountant Vault
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Arab Signature Hotel & Suites • 2-Step Authenticated Terminal
            </p>
          </div>
        </div>

        {/* Security Scope Box */}
        <div className="p-3 rounded-2xl bg-white/5 border border-[#d4af37]/20 text-[11px] text-gray-300 leading-relaxed text-center">
          <ShieldCheck size={14} className="inline text-emerald-400 mr-1 -mt-0.5" />
          High-Security Financial Ledger Gate. Sign-in requires verified staff email, master account password, and your <strong className="text-[#f3e5ab]">6-digit Financial Security PIN</strong> issued by General Management.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs text-center flex items-center justify-center gap-2">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form with 3-Credential Security */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* 1. Username / Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              1. Accountant Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="accountant@arabsignature.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* 2. Master Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              2. Accountant Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Enter accountant password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 3. 6-Digit Financial Security PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#f3e5ab] block">
                3. 6-Digit Financial Security PIN *
              </label>
              <span className="text-[10px] text-gray-400 font-mono">Issued by Super Admin</span>
            </div>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                inputMode="numeric"
                autoComplete="off"
                placeholder="• • • • • •"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-[#d4af37]/40 text-white placeholder-gray-500 text-center tracking-[0.3em] font-mono text-base font-bold focus:outline-none focus:border-[#d4af37]"
              />
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              Mandatory 2FA layer. In case of lost PIN or credentials, contact Super Admin.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-pulse">Validating 2-Step Financial Authorization...</span>
            ) : (
              <>
                <span>Unlock Financial Ledger</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-3 border-t border-white/10 text-center space-y-1.5">
          <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldAlert size={12} className="text-amber-400" />
            <span>Encrypted Gate • 5-Attempt Lockout Protection Enabled</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Confidential Entrance • Only Super Admin in Executive Core can alter Accountant credentials.
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center mt-6 text-[11px] text-gray-500 space-y-1">
        <div>Arab Signature Hotel & Suites • Financial Controller Terminal</div>
        <div>
          Hospitality Software • Built by{' '}
          <a
            href="https://kinggold-one.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4af37] hover:text-[#f3e5ab] font-semibold underline underline-offset-2 transition-colors"
          >
            Microbase
          </a>
        </div>
      </div>
    </div>
  );
}
