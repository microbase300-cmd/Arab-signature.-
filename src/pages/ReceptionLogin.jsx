import React, { useState } from 'react';
import { portalStore } from '../data/portalStore';
import { KeyRound, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Building2 } from 'lucide-react';

export default function ReceptionLogin({ onNavigate }) {
  const [selectedDesk, setSelectedDesk] = useState('Main Building'); // 'Main Building' | 'Extension Building'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDesk = (desk) => {
    setSelectedDesk(desk);
    setError('');
    // Do NOT auto-fill credentials: users must enter their own login
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const user = portalStore.loginReception(username, password);
        setIsLoading(false);
        onNavigate('reception');
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Access Denied: Invalid Front Desk Reception credentials.');
      }
    }, 500);
  };

  // Quick fill removed per operational security requirements

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
      <div className="relative z-10 w-full max-w-md bg-[#16030c]/90 border border-[#d4af37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-7">
        
        {/* Header with Official Option 1 Logo */}
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
              <KeyRound size={11} className="text-[#d4af37]" />
              <span>Front Desk Shift Terminal</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              Receptionist Portal
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Arab Signature Hotel & Suites • Nsugbe, Onitsha
            </p>
          </div>
        </div>

        {/* Dual Building Desk Selector Tabs */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block text-center">
            Select Your Assigned Front Desk
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => handleSelectDesk('Main Building')}
              className={`py-2.5 px-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                selectedDesk === 'Main Building'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building2 size={14} />
                <span>Main Building</span>
              </div>
              <span className={`text-[9px] ${selectedDesk === 'Main Building' ? 'text-black/80 font-mono font-bold' : 'text-gray-500'}`}>
                Rooms 601 – 620
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectDesk('Extension Building')}
              className={`py-2.5 px-2 rounded-xl font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                selectedDesk === 'Extension Building'
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Building2 size={14} />
                <span>Extension Wing</span>
              </div>
              <span className={`text-[9px] ${selectedDesk === 'Extension Building' ? 'text-black/80 font-mono font-bold' : 'text-gray-500'}`}>
                Rooms 101 – 114
              </span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 leading-relaxed text-center">
            {selectedDesk === 'Main Building' ? (
              <span>🏢 <strong>Main Building Desk:</strong> You have check-in & room control for <strong>Rooms 601–620</strong>, plus live view-only visibility of Extension rooms.</span>
            ) : (
              <span>🏛️ <strong>Extension Desk:</strong> You have check-in & room control for <strong>Rooms 101–114</strong>, plus live view-only visibility of Main Building rooms.</span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              Receptionist Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="off"
                placeholder={selectedDesk === 'Main Building' ? 'e.g. main@arabsignature.com' : 'e.g. extension@arabsignature.com'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">
              Reception Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Enter front desk password"
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-pulse">Opening Front Desk Register...</span>
            ) : (
              <>
                <span>Sign In to Front Desk</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* Operational Security Notice */}
        <div className="pt-4 border-t border-white/10 text-center space-y-1.5">
          <div className="text-[11px] text-gray-400">
            Authorized Front Desk Staff Only • Passwords managed by General Manager
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-gray-400 py-0.5">
            <button
              type="button"
              onClick={() => onNavigate('accountant-login')}
              className="hover:text-[#f3e5ab] underline underline-offset-2"
            >
              Accountant Portal
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="hover:text-[#f3e5ab] underline underline-offset-2"
            >
              Executive GM Login
            </button>
          </div>
          <div className="text-[10px] text-gray-500">
            All shift sign-ins and operational actions are logged to the Security Audit Trail.
          </div>
        </div>

      </div>

      <div className="relative z-10 text-center mt-6 text-[11px] text-gray-500 space-y-1">
        <div>Arab Signature Hotel & Suites • Front Desk Terminal</div>
        <div>Hospitality Software • Built by <a href="https://kinggold-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-[#f3e5ab] font-semibold underline underline-offset-2 transition-colors">Microbase</a></div>
      </div>

    </div>
  );
}
