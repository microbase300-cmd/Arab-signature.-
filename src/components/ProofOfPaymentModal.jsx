import React from 'react';
import { X, Download, ShieldCheck, CheckCircle2, Clock, Calendar, User, CreditCard, Building2, ExternalLink } from 'lucide-react';

export default function ProofOfPaymentModal({
  booking,
  onClose,
  onStampAudit,
  onConfirmPayment,
  isAccountantView = false,
  isAdminView = false
}) {
  if (!booking) return null;

  const hasImage = Boolean(booking.proofOfPaymentImage);
  const imageSrc = booking.proofOfPaymentImage;

  const handleDownload = () => {
    if (!imageSrc) return;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `Proof_${booking.id}_${booking.guestName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#140209] border border-[#d4af37]/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-xs my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5c0725] border border-[#d4af37]/40 text-[#f3e5ab]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-bold text-base sm:text-lg text-white">
                  Proof of Payment Slip
                </h3>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#5c0725]/60 text-[#f3e5ab] border border-[#d4af37]/30">
                  {booking.id}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Audited front-desk / online verification slip for {booking.guestName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Booking Info Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-black/60 border border-white/10 text-gray-300">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Guest Name</span>
            <strong className="text-white text-xs truncate block mt-0.5">{booking.guestName}</strong>
            <span className="text-[10px] text-gray-400 font-mono">{booking.phone}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Suite & Room</span>
            <strong className="text-[#f3e5ab] text-xs truncate block mt-0.5">{booking.roomName}</strong>
            <span className="text-[10px] text-gray-400 font-mono">Room #{booking.roomNumber || 'Pending'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Billed Amount</span>
            <strong className="text-emerald-400 text-sm font-mono block mt-0.5">
              ₦{Number(booking.amount || 0).toLocaleString()}
            </strong>
            <span className="text-[10px] text-gray-400 font-mono">{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Payment Mode</span>
            <strong className="text-white text-xs block mt-0.5">{booking.paymentMethod}</strong>
            <span className={`text-[10px] font-mono font-bold ${booking.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {booking.paymentStatus || 'Paid'}
            </span>
          </div>
        </div>

        {/* Text Reference Note if present */}
        {booking.proofOfPayment && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Transaction Reference / Teller Slip:</span>
            <span className="font-mono font-bold text-[#f3e5ab]">{booking.proofOfPayment}</span>
          </div>
        )}

        {/* The Uploaded Image Viewer */}
        <div className="rounded-2xl bg-black/80 border border-white/15 overflow-hidden flex flex-col items-center justify-center min-h-[220px] max-h-[380px] p-2 relative group">
          {hasImage ? (
            <img
              src={imageSrc}
              alt={`Proof of payment for ${booking.id}`}
              className="max-h-[360px] w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform"
            />
          ) : (
            <div className="text-center p-8 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
                <CreditCard size={22} />
              </div>
              <p className="text-gray-400 font-medium">No Image Uploaded for This Transaction</p>
              <p className="text-[11px] text-gray-500 max-w-sm">
                This transaction was processed without an attached slip image. Text reference: <span className="text-white font-mono">{booking.proofOfPayment || booking.paymentMethod || 'Front Desk POS'}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasImage && (
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
              >
                <Download size={13} />
                <span>Download Slip Image</span>
              </button>
            )}
            {hasImage && (
              <a
                href={imageSrc}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink size={13} />
                <span>Open Fullscreen</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Accountant Audit Button if viewed by Accountant */}
            {isAccountantView && onStampAudit && (
              <button
                type="button"
                onClick={() => {
                  onStampAudit(booking.id);
                  onClose();
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                  booking.accountantAudited
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                }`}
              >
                <CheckCircle2 size={14} />
                <span>{booking.accountantAudited ? 'Audit Already Stamped' : 'Verify & Stamp Audit'}</span>
              </button>
            )}

            {/* Admin Backend Confirm Button if viewed by Admin */}
            {isAdminView && onConfirmPayment && booking.paymentStatus !== 'Paid' && (
              <button
                type="button"
                onClick={() => {
                  onConfirmPayment(booking.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>Confirm Payment Backend</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
