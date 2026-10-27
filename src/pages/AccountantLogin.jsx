import React, { useState, useEffect } from 'react';
import { portalStore, SECURE_PORTAL_ROUTES } from '../data/portalStore';
import {
  Calculator, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, KeyRound, ShieldAlert, Mail, RotateCw, CheckCircle2
} from 'lucide-react';

export default function AccountantLogin({ onNavigate }) {
  const existingAcc = portalStore.getAccountantUser();
  const [step, setStep] = useState(1); // 1 = Credentials, 2 = 6-digit Email OTP
  const [username, setUsername] = useState(existingAcc?.username || 'accountant@arabsignature.com');
  const [password, setPassword] = useState('');
  const [phoneOtpEmail, setPhoneOtpEmail] = useState(existingAcc?.otpEmail || '');
  const [dispatchedToEmail, setDispatchedToEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');

  // Resend OTP countdown & cooldown
  const [countdown, setCountdown] = useState(600); // 10 minutes (600s)
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  useEffect(() => {
    let cooldownTimer;
    if (resendCooldown > 0) {
      cooldownTimer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Validate Credentials & Dispatch 6-Digit Email OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!username.trim()) {
      setError('Please provide your Chief Accountant username or email.');
      return;
    }
    if (!password) {
      setError('Please provide your Accountant master password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await portalStore.requestAccountantOtp(username, password, phoneOtpEmail);
      setIsLoading(false);
      setDispatchedToEmail(res.email);
      setStep(2);
      setCountdown(600);
      setResendCooldown(60);
      setSuccessNotice(`Security OTP dispatched via Resend to ${res.email}`);

      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Access Denied: Invalid Hotel Accountant credentials.');
    }
  };

  // Step 2: Verify 6-Digit OTP and Enter Vault
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit OTP passcode sent to your email.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        portalStore.verifyAccountantOtp(username, password, otpCode);
        setIsLoading(false);
        onNavigate(SECURE_PORTAL_ROUTES.ACCOUNTANT_PORTAL);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Access Denied: Invalid or expired 6-digit OTP passcode.');
      }
    }, 550);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccessNotice('');
    setIsLoading(true);

    try {
      const res = await portalStore.requestAccountantOtp(username, password, phoneOtpEmail);
      setIsLoading(false);
      setDispatchedToEmail(res.email);
      setCountdown(600);
      setResendCooldown(60);
      setSuccessNotice(`New 6-digit security OTP sent to ${res.email}`);
      if (res.devOtp) setDevOtpHint(res.devOtp);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to dispatch new OTP.');
    }
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
              Arab Signature Hotel & Suites &bull; {step === 1 ? 'Step 1: Credentials' : 'Step 2: Email OTP Clearance'}
            </p>
          </div>
        </div>

        {/* Security Scope Notice */}
        <div className="p-3 rounded-2xl bg-white/5 border border-[#d4af37]/20 text-[11px] text-gray-300 leading-relaxed text-center">
          <ShieldCheck size={14} className="inline text-emerald-400 mr-1 -mt-0.5" />
          {step === 1
            ? 'High-Security Financial Ledger Gate. Sign-in requires staff credentials and a dynamic 6-digit Email OTP via Resend.'
            : 'Two-Factor Clearance: Enter the 6-digit one-time passcode dispatched to your official registered staff email.'}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs text-center flex items-center justify-center gap-2">
            <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success / Info Alert */}
        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* STEP 1: USERNAME & PASSWORD FORM */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
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

            {/* 3. Phone Email Inbox to Receive 6-Digit OTP */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.03] border border-[#d4af37]/25">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#f3e5ab] block">
                  3. Phone Email Inbox (Receives 6-Digit OTP)
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Via Resend</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter Gmail / phone email to receive OTP"
                  value={phoneOtpEmail}
                  onChange={(e) => setPhoneOtpEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Enter the personal email logged into your phone (e.g. Gmail/iCloud) so <strong className="text-gray-200">security@arabsignature.com</strong> delivers your 6-digit OTP straight to your mobile inbox.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Validating &amp; Generating OTP...</span>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Verify &amp; Send Email OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-DIGIT EMAIL OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="text-xs text-gray-400">
                A 6-digit one-time passcode was dispatched to:
              </div>
              <div className="text-sm font-semibold text-[#f3e5ab] font-mono">
                {dispatchedToEmail || phoneOtpEmail || username || 'accountant@arabsignature.com'}
              </div>
            </div>

            {/* 6-Digit OTP Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#f3e5ab] block">
                  Enter 6-Digit Security OTP *
                </label>
                <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1">
                  Expires in: <strong>{formatTime(countdown)}</strong>
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-black/80 border-2 border-[#d4af37]/60 text-[#f3e5ab] placeholder-gray-600 text-center tracking-[0.4em] font-mono text-xl font-bold focus:outline-none focus:border-[#d4af37] shadow-inner shadow-black"
                />
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              </div>

              {/* Development sandbox hint if active */}
              {devOtpHint && (
                <div className="p-2.5 rounded-lg bg-white/5 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-center justify-between">
                  <span>Sandbox Quick-Fill: <strong>{devOtpHint}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(devOtpHint)}
                    className="text-xs text-[#d4af37] font-semibold underline hover:text-[#f3e5ab]"
                  >
                    Paste Code
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-40"
            >
              {isLoading ? (
                <span className="animate-pulse">Authorizing Financial Session...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Verify OTP &amp; Unlock Vault</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Resend & Back Controls */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode('');
                  setError('');
                }}
                className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Change Credentials</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleResendOtp}
                className="text-[#d4af37] hover:text-[#f3e5ab] disabled:opacity-40 flex items-center gap-1 transition-colors font-semibold"
              >
                <RotateCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend OTP Code'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="pt-3 border-t border-white/10 text-center space-y-1.5">
          <div className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldAlert size={12} className="text-amber-400" />
            <span>Encrypted Gate &bull; Dynamic Email OTP Authentication Enabled</span>
          </div>
          <div className="text-[10px] text-gray-500">
            Emergency Master Financial PIN (742918) accepted as secondary fail-safe.
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center mt-6 text-[11px] text-gray-500 space-y-1">
        <div>Arab Signature Hotel &amp; Suites &bull; Financial Controller Terminal</div>
        <div>
          Hospitality Software &bull; Built by{' '}
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
