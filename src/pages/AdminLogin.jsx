import React, { useState } from 'react';
import { portalStore, SECURE_PORTAL_ROUTES } from '../data/portalStore';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLogin({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        portalStore.loginAdmin(username, password);
        setIsLoading(false);
        onNavigate(SECURE_PORTAL_ROUTES.ADMIN_PORTAL);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Access Denied: Invalid Executive Admin credentials.');
      }
    }, 600);
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
      <div className="relative z-10 w-full max-w-md bg-[#16030c]/90 border border-[#d4af37]/50 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-7">
        
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
              <ShieldCheck size={11} className="text-[#d4af37]" />
              <span>Restricted Executive Access Gate</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              General Manager Admin Core
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Arab Signature Hotel & Suites • Executive Operations Command
            </p>
          </div>
        </div>

        {/* Security Scope Notice */}
        <div className="p-3 rounded-2xl bg-white/5 border border-[#d4af37]/20 text-[11px] text-gray-300 leading-relaxed text-center">
          Executive access point with centralized authority over all hotel wings, accounting records, and staff credential management.
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
            <ShieldAlert size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              Executive Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="admin@arabsignature.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              Admin Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="••••••••••••"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating Executive Session...</span>
            ) : (
              <>
                <span>Access Management System</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-white/10 text-center space-y-1.5">
          <div className="text-[11px] text-gray-400">
            For verified Executive General Managers only. All login attempts are recorded.
          </div>
          <div className="text-[10px] text-gray-500">
            Confidential Gate • Authorized personnel only.
          </div>
        </div>

      </div>

      <div className="relative z-10 text-center mt-6 text-[11px] text-gray-500 space-y-1">
        <div>Arab Signature Hotel & Suites • Executive Management System</div>
        <div>Software Infrastructure • Built by <a href="https://kinggold-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#f3e5ab] font-semibold underline underline-offset-2 transition-colors">Microbase</a></div>
      </div>

    </div>
  );
}
