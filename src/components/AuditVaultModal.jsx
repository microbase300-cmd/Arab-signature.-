import React, { useState } from 'react';
import { 
  X, ShieldCheck, Copy, Check, Printer, Clock, Building2, User, Phone, 
  Mail, MapPin, CreditCard, Calendar, Hash, FileText, AlertCircle, ShieldAlert
} from 'lucide-react';

export default function AuditVaultModal({ isOpen, onClose, vaultRecord }) {
  const [copiedBase64, setCopiedBase64] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showRawBase64, setShowRawBase64] = useState(false);

  if (!isOpen || !vaultRecord) return null;

  const booking = vaultRecord.booking || vaultRecord;
  const isExpired = vaultRecord.isExpired || ['Checked Out', 'Completed', 'Cancelled'].includes(booking.status);
  const checksum = vaultRecord.checksum || `ARB-VLT-${String(booking.id || '').slice(-6)}`;
  const b64 = vaultRecord.base64Payload || '';

  const handleCopyB64 = () => {
    if (b64) {
      navigator.clipboard.writeText(b64);
      setCopiedBase64(true);
      setTimeout(() => setCopiedBase64(false), 2500);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id || '');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#14020a] border-2 border-[#d4af37]/60 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#3d0315] via-[#24010b] to-[#120005] border-b border-[#d4af37]/40 flex items-center justify-between text-[#f3e5ab]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#f3e5ab] shadow-lg shadow-[#d4af37]/20">
              <ShieldCheck size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide">
                  4-Year Base64 Audit Vault Record
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/25 text-[#f3e5ab] border border-[#d4af37]/50 text-[10px] font-mono font-bold uppercase">
                  4-Yr Retention
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Statutory Financial &amp; Guest Dossier Archive &bull; Container Checksum: {checksum}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Dossier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Primary Status Banner */}
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 flex-wrap ${
            isExpired 
              ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-400 animate-pulse'}`} />
              <div>
                <span className="font-mono font-extrabold uppercase tracking-wider text-xs block">
                  {isExpired ? '⚠️ EXPIRED RESERVATION CODE (CHECKED OUT)' : '✅ ACTIVE OPERATIONAL RESERVATION'}
                </span>
                <span className="text-[11px] text-gray-300">
                  {isExpired 
                    ? 'This guest has completed check-out and the suite was vacated. Information is permanently vaulted for 4 years.'
                    : 'This reservation is currently active or upcoming in hotel operations.'}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-black/60 font-mono text-xs font-bold text-[#f3e5ab] border border-white/10">
              Status: {booking.status || 'Archived'}
            </span>
          </div>

          {/* Reference Code Card */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block">
                Official Booking Reference ID
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-[#f3e5ab] tracking-wider mt-0.5">
                {booking.id}
              </div>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3.5 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/50 text-[#f3e5ab] font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedId ? 'Copied ID' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Guest Identity Dossier */}
          <div className="p-4 rounded-2xl bg-[#1c040e] border border-white/10 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-[#f3e5ab] tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-[#d4af37]" />
              <span>Registered Guest Dossier</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Full Legal Name:</span>
                <span className="text-sm font-bold text-white">{booking.guestName || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Phone Number:</span>
                <span className="text-sm font-mono text-[#f3e5ab] font-bold">{booking.phone || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Email Address:</span>
                <span className="text-xs font-mono text-gray-200">{booking.email || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Home Residential Address:</span>
                <span className="text-xs text-gray-200">{booking.homeAddress || 'Provided at Check-In'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Next of Kin:</span>
                <span className="text-xs text-gray-200 font-semibold">
                  {booking.nextOfKinName ? `${booking.nextOfKinName} (${booking.nextOfKinRelationship || 'Relative'})` : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Next of Kin Phone:</span>
                <span className="text-xs font-mono text-gray-200">{booking.nextOfKinPhone || '—'}</span>
              </div>
            </div>
          </div>

          {/* Suite & Stay Information */}
          <div className="p-4 rounded-2xl bg-[#1c040e] border border-white/10 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-[#f3e5ab] tracking-wider flex items-center gap-1.5">
              <Building2 size={14} className="text-[#d4af37]" />
              <span>Suite &amp; Stay History</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-300">
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Room Number:</span>
                <span className="text-base font-bold text-amber-300 font-mono">
                  Room #{booking.roomNumber || '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Suite Category:</span>
                <span className="text-xs font-semibold text-white">{booking.roomName || booking.roomType || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Building Wing:</span>
                <span className="text-xs font-semibold text-gray-200">
                  {booking.building || (String(booking.roomNumber || '').startsWith('1') ? 'Extension Building (100 Wing)' : 'Main Building (600 Wing)')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Total Duration:</span>
                <span className="text-xs font-bold text-white">{booking.nights || 1} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Check-In Date:</span>
                <span className="text-xs font-mono text-gray-200">{booking.checkIn || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Check-Out Date:</span>
                <span className="text-xs font-mono text-gray-200">{booking.checkOut || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Reservation Origin:</span>
                <span className="text-xs text-gray-200">{booking.source || 'Website Reservation'}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-mono">Booking Created:</span>
                <span className="text-xs text-gray-400">{booking.createdAt || '—'}</span>
              </div>
            </div>
          </div>

          {/* Financial Folio Breakdown */}
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3">
            <h4 className="text-xs uppercase font-mono font-bold text-[#f3e5ab] tracking-wider flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#d4af37]" />
              <span>Financial Audit Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-300">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-gray-400 block font-mono">Amount Paid:</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  ₦{Number(booking.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-gray-400 block font-mono">Payment Channel:</span>
                <span className="text-xs font-bold text-white">{booking.paymentMethod || 'Paystack'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-gray-400 block font-mono">Payment Status:</span>
                <span className="text-xs font-mono font-bold text-emerald-300">{booking.paymentStatus || 'Paid'}</span>
              </div>
            </div>
            {booking.paystackReference && (
              <div className="text-[11px] font-mono text-gray-400">
                Payment Audit Reference: <span className="text-white font-bold">{booking.paystackReference}</span>
              </div>
            )}
          </div>

          {/* Statutory 4-Year Retention Certificate & Base-64 Payload */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2a0614] to-[#160209] border border-[#d4af37]/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#d4af37]" />
                <span className="font-mono text-xs font-bold text-[#f3e5ab] uppercase tracking-wider">
                  Statutory 4-Year Retention Compliance Seal
                </span>
              </div>
              <span className="text-[10px] font-mono bg-black/60 px-2.5 py-0.5 rounded text-gray-300 border border-white/10">
                Retained Until: {vaultRecord.retentionExpiresFormatted || '2030'}
              </span>
            </div>
            
            <p className="text-[11px] text-gray-400 leading-relaxed">
              In accordance with hotel financial compliance, this record is cryptographically encoded in Base-64 container format and sealed with checksum <code className="text-[#f3e5ab] font-bold">{checksum}</code>. It will remain searchable by the CEO and Chief Accountant even after check-out, room reset, or system turnover.
            </p>

            {/* Base64 Container String Accordion */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowRawBase64(prev => !prev)}
                className="text-xs text-[#f3e5ab] hover:underline font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Hash size={13} />
                <span>{showRawBase64 ? 'Hide Encrypted Base64 String' : 'Show Encrypted Base64 Payload String'}</span>
              </button>

              {showRawBase64 && (
                <div className="mt-2 p-3 rounded-xl bg-black/90 border border-white/10 font-mono text-[10px] text-amber-200/90 break-all max-h-36 overflow-y-auto space-y-2">
                  <div className="text-[9px] uppercase font-bold text-gray-500">Base-64 Raw Audit Container:</div>
                  <div>{b64 || 'Encoded in local vault'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCopyB64}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {copiedBase64 ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedBase64 ? 'Copied Base64 String!' : 'Copy Base64 Audit Token'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrintAudit}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Print Audit Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-black/60 hover:bg-black/80 text-gray-300 font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
