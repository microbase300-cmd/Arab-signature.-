import React from 'react';
import { ShieldCheck, AlertCircle, Check, Lock, CreditCard, Building2, Smartphone } from 'lucide-react';

/**
 * Advanced Executive Fintech Payment Confirmation Card
 * Features:
 * - Luxury glassmorphic frame with gold accent gradient & ambient glow
 * - High-impact Tax & VAT breakdown with statutory clarity
 * - Interactive agreement checkbox with animated micro-states
 * - Prominent, ultra-bold Total Payable banner
 * - Authentic payment channel badges (Visa, Mastercard, Verve, Bank Transfer, USSD)
 * - Bank-grade 256-bit SSL trust footer
 */
export default function PaymentConfirmationBox({
  title = 'Payment Confirmation',
  subtotalLabel = 'Item / Stay Subtotal',
  breakdown,
  agreed,
  onToggleAgreed,
  showValidationError = false,
  checkboxRef = null
}) {
  if (!breakdown) return null;

  const { netAmount = 0, taxAndVatFee = 0, grossAmount = 0 } = breakdown;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e0510] via-[#100208] to-[#080104] border-2 border-[#d4af37]/80 ring-1 ring-[#d4af37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 sm:p-5 space-y-3.5 transition-all">
      {/* Top Ambient Gold Light Bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />

      {/* Header Strip with Security Badge */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37]">
            <ShieldCheck size={14} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#f3e5ab] font-black block leading-none">
              {title}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              Direct Verified Settlement
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Instant Lock</span>
        </div>
      </div>

      {/* Accepted Payment Rails Strip */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-gray-300 font-medium">
        <span className="text-gray-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
          <CreditCard size={11} className="text-[#d4af37]" /> Channels:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[9px] tracking-wide border border-white/15">
            Mastercard
          </span>
          <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-200 font-bold text-[9px] tracking-wide border border-blue-500/30">
            VISA
          </span>
          <span className="px-1.5 py-0.5 rounded bg-teal-950/80 text-teal-200 font-bold text-[9px] tracking-wide border border-teal-500/30">
            Verve
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-200 font-bold text-[9px] tracking-wide border border-purple-500/30 flex items-center gap-0.5">
            <Building2 size={9} /> Transfer
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-200 font-bold text-[9px] tracking-wide border border-amber-500/30 flex items-center gap-0.5">
            <Smartphone size={9} /> USSD
          </span>
        </div>
      </div>

      {/* Base Listed Price */}
      <div className="flex items-center justify-between text-xs sm:text-sm px-1 pt-0.5">
        <span className="text-gray-300 font-medium">{subtotalLabel}:</span>
        <span className="font-mono font-bold text-white text-sm sm:text-base">
          ₦{Number(netAmount).toLocaleString()}
        </span>
      </div>

      {/* Prominent Eye-Catching TAX & VAT Highlight Strip */}
      <div className="relative overflow-hidden p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-600/20 border-2 border-amber-400/80 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(245,158,11,0.18)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
              Tax &amp; VAT
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 border border-amber-300/40 text-[9px] font-mono font-bold text-amber-200 uppercase">
              Statutory 7.5% + Gateway Levy
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-100/85 block leading-tight">
            Transparent commission pass-through added to order
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-lg sm:text-xl font-black text-amber-300 drop-shadow-[0_1px_8px_rgba(251,191,36,0.5)]">
            +₦{Number(taxAndVatFee).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Checkbox Directly Below the VAT */}
      <div ref={checkboxRef} className="pt-0.5">
        <label
          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
            agreed
              ? 'bg-emerald-950/50 border-emerald-400/70 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : showValidationError
              ? 'bg-rose-950/70 border-rose-400 text-rose-100 ring-2 ring-rose-400/60 animate-pulse'
              : 'bg-black/70 border-[#d4af37]/50 hover:border-[#d4af37] text-gray-200 hover:bg-black/90'
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={Boolean(agreed)}
              onChange={(e) => onToggleAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-[#d4af37] bg-black accent-[#d4af37] cursor-pointer"
            />
          </div>
          <div className="text-xs leading-snug flex-1">
            <span className="font-bold text-white block">
              I agree to the <span className="text-amber-300 font-extrabold underline underline-offset-2">Tax &amp; VAT</span> (+₦{Number(taxAndVatFee).toLocaleString()}) added to my bill.
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Mandatory agreement required before launching verified payment gateway.
            </span>
          </div>
          {agreed ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <Check size={13} className="stroke-[3]" />
            </div>
          ) : (
            <span className="text-[10px] font-mono text-gray-400 shrink-0 uppercase mt-0.5">
              Tap to agree
            </span>
          )}
        </label>

        {!agreed && showValidationError && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-300 px-1">
            <AlertCircle size={14} className="text-rose-400 shrink-0" />
            <span>Please tick the agreement box above to confirm Tax &amp; VAT before paying.</span>
          </div>
        )}
      </div>

      {/* Extra-Bold High-Contrast TOTAL PAYABLE Banner */}
      <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-black via-[#16060c] to-black border-2 border-[#d4af37] flex items-center justify-between gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.35)]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Total Payable
            </span>
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono font-bold text-[#f3e5ab] uppercase">
              Final Charge
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#d4af37] block">
            Net-Settled • Zero Hidden Charges
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl sm:text-3xl font-black text-[#f3e5ab] tracking-tight drop-shadow-[0_2px_12px_rgba(212,175,55,0.55)]">
            ₦{Number(grossAmount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Security & Bank Regulatory Assurance Footer */}
      <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-gray-400 font-mono text-center">
        <Lock size={11} className="text-[#d4af37] shrink-0" />
        <span>Bank-Grade 256-Bit SSL • Central Bank of Nigeria (CBN) Licensed Gateway</span>
      </div>
    </div>
  );
}
