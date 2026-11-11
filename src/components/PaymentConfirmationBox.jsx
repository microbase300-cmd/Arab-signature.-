import React from 'react';
import { ShieldCheck, AlertCircle, Check } from 'lucide-react';

/**
 * Reusable Payment Confirmation Card displaying the listed subtotal,
 * an eye-catching Tax & VAT breakdown, a bold Total Payable banner,
 * and a mandatory agreement checkbox directly below the VAT.
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
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2d0616] via-[#18020b] to-[#0d0106] border-2 border-[#d4af37]/70 space-y-3 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
        <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#f3e5ab] font-extrabold flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#d4af37]" />
          <span>{title}</span>
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[10px] font-mono font-bold text-[#f3e5ab] uppercase">
          Review &amp; Confirm
        </span>
      </div>

      {/* Base Listed Price */}
      <div className="flex items-center justify-between text-xs sm:text-sm px-1">
        <span className="text-gray-300 font-medium">{subtotalLabel}:</span>
        <span className="font-mono font-bold text-white text-sm sm:text-base">
          ₦{Number(netAmount).toLocaleString()}
        </span>
      </div>

      {/* Prominent Eye-Catching TAX & VAT Highlight Strip */}
      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/70 flex items-center justify-between gap-3 shadow-md">
        <div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 block">
            Tax &amp; VAT
          </span>
          <span className="text-[10px] sm:text-[11px] text-amber-100/80 block">
            Gateway Commission &amp; Statutory 7.5% VAT
          </span>
        </div>
        <span className="font-mono text-base sm:text-lg font-black text-amber-300 shrink-0">
          +₦{Number(taxAndVatFee).toLocaleString()}
        </span>
      </div>

      {/* Checkbox Directly Below the VAT */}
      <div ref={checkboxRef}>
        <label
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
            agreed
              ? 'bg-emerald-950/45 border-emerald-400/60 text-emerald-100'
              : showValidationError
              ? 'bg-rose-950/60 border-rose-400 text-rose-100 ring-2 ring-rose-400/50 animate-pulse'
              : 'bg-black/60 border-[#d4af37]/45 hover:border-[#d4af37] text-gray-200'
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
              I agree to the <span className="text-amber-300 underline underline-offset-2">Tax &amp; VAT</span> (+₦{Number(taxAndVatFee).toLocaleString()}) added to my bill.
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">
              Required confirmation before launching Paystack checkout.
            </span>
          </div>
          {agreed && <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />}
        </label>

        {!agreed && showValidationError && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-300 px-1">
            <AlertCircle size={13} className="text-rose-400 shrink-0" />
            <span>Please tick the checkbox above to agree to Tax &amp; VAT before paying.</span>
          </div>
        )}
      </div>

      {/* Extra-Bold High-Contrast TOTAL PAYABLE Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-black/85 border-2 border-[#d4af37] flex items-center justify-between gap-2 shadow-xl">
        <div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white block">
            Total Payable
          </span>
          <span className="text-[10px] font-mono text-[#d4af37] block">
            Exact Amount Charged on Paystack
          </span>
        </div>
        <span className="font-mono text-2xl sm:text-3xl font-black text-[#f3e5ab] tracking-tight drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]">
          ₦{Number(grossAmount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
