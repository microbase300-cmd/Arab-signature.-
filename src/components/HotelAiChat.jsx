import React, { useState, useEffect, useRef } from 'react';
import { hotelAiEngine } from '../utils/hotelAiEngine';
import { portalStore } from '../data/portalStore';
import { 
  Sparkles, MessageSquare, X, Send, Bot, User, 
  ShieldCheck, BedDouble, ChevronRight, Phone, RefreshCw, Key
} from 'lucide-react';

export default function HotelAiChat({ onOpenBooking, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [liveAvailableCount, setLiveAvailableCount] = useState(() => {
    return hotelAiEngine.refreshBrain().availableRooms.length;
  });
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });
  const prevAvailCountRef = useRef(liveAvailableCount);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Warm greetings and welcome to **Arab Signature Hotel & Suites**, Nsugbe, Onitsha! 👑\n\nI am **Amira**, your Royal AI Concierge. I can assist you with:\n• Checking **live room availability** right now\n• Securely tracking your **booking reference** (e.g. `ARS-BGD-7812` or `ARS-EXT-9421`)\n• Suite pricing, directions to Nsugbe, or dining menus.\n\nHow may I assist your stay today?",
      suggestions: [
        "Check Available Suites",
        "Track My Booking Code",
        "Directions to Nsugbe",
        "View Suite Rates"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Start 5-second Client-Side AI Brain Auto-Refresh + Cloud API Listeners
  useEffect(() => {
    const syncCurrentRooms = async (force = false) => {
      // Skip background polling if tab is minimized or hidden (saves data & battery)
      if (!force && typeof document !== 'undefined' && document.hidden) return;

      // 1. Instant local sync (0ms latency)
      const currentRooms = portalStore.getRooms();
      const avail = currentRooms.filter(r => r.status === 'available').length;
      
      setLiveAvailableCount(avail);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // 2. Background cloud sync to catch updates from other browser profiles or devices
      try {
        const cloudRooms = await portalStore.syncRoomsFromCloud();
        if (cloudRooms && Array.isArray(cloudRooms)) {
          const cloudAvail = cloudRooms.filter(r => r.status === 'available').length;
          setLiveAvailableCount(cloudAvail);
        }
      } catch (e) {
        // offline fallback
      }
    };

    // Immediate initial sync
    syncCurrentRooms();

    // 5-second client-side heartbeat
    const intervalId = setInterval(syncCurrentRooms, 5000);

    // Instant event listeners
    const unsubPortal = portalStore.subscribeRooms(() => {
      syncCurrentRooms();
    });
    window.addEventListener('ash_rooms_updated', syncCurrentRooms);
    window.addEventListener('ash_ai_brain_refreshed', syncCurrentRooms);
    window.addEventListener('storage', syncCurrentRooms);
    window.addEventListener('focus', syncCurrentRooms);
    document.addEventListener('visibilitychange', syncCurrentRooms);

    return () => {
      clearInterval(intervalId);
      unsubPortal();
      window.removeEventListener('ash_rooms_updated', syncCurrentRooms);
      window.removeEventListener('ash_ai_brain_refreshed', syncCurrentRooms);
      window.removeEventListener('storage', syncCurrentRooms);
      window.removeEventListener('focus', syncCurrentRooms);
      document.removeEventListener('visibilitychange', syncCurrentRooms);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Append User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // If user clicked a direct WhatsApp action chip
    if (text.toLowerCase().includes("whatsapp")) {
      window.open(
        "https://wa.me/2348125786875?text=Hello%20Arab%20Signature%20Hotel%20%26%20Suites%2C%20I%20was%20chatting%20with%20Amira%20AI%20and%20would%20like%20direct%20Front%20Desk%20assistance.",
        "_blank",
        "noopener,noreferrer"
      );
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "I have opened a **direct WhatsApp chat** with our 24/7 Front Desk Reception in Nsugbe (`0812 578 6875`). I am **Amira**, and I remain right here if you also want to check live suite availability or rates!",
            suggestions: ["Check Available Suites", "View Suite Rates"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 400);
      return;
    }

    // If user clicked a direct reserve action
    if (text.toLowerCase().includes("reserve") || text.toLowerCase().includes("book a suite")) {
      setTimeout(() => {
        setIsTyping(false);
        if (onOpenBooking) onOpenBooking('deluxe');
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "I am **Amira**, your Royal AI Concierge — I have opened our secure direct reservation window for you now. You can choose your suite dates and complete instant Paystack checkout.",
            suggestions: ["Check Available Suites", "Track My Booking"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // Process with AI Engine
    setTimeout(async () => {
      try {
        await Promise.race([
          portalStore.syncRoomsFromCloud(),
          new Promise(r => setTimeout(r, 800))
        ]).catch(() => {});

        const response = hotelAiEngine.processQuery(text);
        const currentAvail = portalStore.getRooms().filter(r => r.status === 'available').length;
        setLiveAvailableCount(currentAvail);
        prevAvailCountRef.current = currentAvail;
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: response.text,
            isAvailabilityMsg: !!response.isAvailabilityReport,
            suggestions: response.suggestions || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        console.error("AI chat processing error:", err);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: "ai",
            text: "Warm greetings from Arab Signature Hotel. I am **Amira**, your Royal AI Concierge. How may I assist your stay or reservation today?",
            suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 250);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const directWhatsAppUrl = "https://wa.me/2348125786875?text=Hello%20Arab%20Signature%20Hotel%20%26%20Suites%2C%20I%20would%20like%20to%20chat%20with%20the%20Front%20Desk%20Concierge.";

  return (
    <>
      {/* 1. Floating Action Stack: Direct WhatsApp Chat Above Amira AI Launcher */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
          {/* Direct WhatsApp Button (Positioned directly above Amira AI) */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#075e54] border-2 border-[#d4af37] text-white shadow-2xl shadow-black/80 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
            title="Direct WhatsApp Chat with Front Desk"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#25D366] border border-white/40 flex items-center justify-center flex-shrink-0 shadow-inner">
              <MessageSquare size={16} className="text-black fill-black" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#075e54]" />
            </div>
            <div className="hidden sm:flex flex-col text-left pr-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-white tracking-wider uppercase">
                <span>Direct WhatsApp</span>
              </div>
              <span className="text-[10px] text-emerald-100">24/7 Front Desk Chat</span>
            </div>
          </a>

          {/* Amira — Royal AI Concierge Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#5c0725] via-[#7d0a33] to-[#420317] border-2 border-[#d4af37] text-white shadow-2xl shadow-black/80 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
            title="Chat with Amira — Arab Signature Hotel Royal AI Concierge"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/60 bg-[#120208] flex-shrink-0">
              <img src="/logo.jpg" alt="Amira AI Logo" className="w-full h-full object-cover scale-110" />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#120208] animate-ping" />
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#f3e5ab] tracking-wider uppercase">
                <Sparkles size={11} className="text-[#d4af37]" />
                <span>Amira • AI Concierge</span>
              </div>
              <span className="text-[10px] text-gray-300">{liveAvailableCount} Suites Ready</span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Interactive Amira AI Concierge Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] flex flex-col items-end gap-2.5 font-sans">
          
          {/* Floating Direct WhatsApp Pill right above the open AI Chat Drawer */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#075e54] border border-[#d4af37] text-white shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
            title="Switch to Direct WhatsApp Chat with Front Desk"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <MessageSquare size={14} className="text-[#f3e5ab]" />
            <span>Direct WhatsApp Chat (Front Desk)</span>
          </a>

          <div className="w-full h-[550px] max-h-[80vh] bg-[#14020a]/95 border border-[#d4af37]/50 rounded-3xl shadow-2xl shadow-black flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210] border-b border-[#d4af37]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#d4af37]/60 bg-[#120208] shadow-md flex-shrink-0">
                  <img src="/logo.jpg" alt="Amira Monogram" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-cinzel font-bold text-sm text-[#f3e5ab] tracking-wide">
                      Amira — Royal AI
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold border border-emerald-500/30">
                      Live Auto-Sync
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-300">
                    Royal AI Concierge • Nsugbe, Onitsha
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={async () => {
                    try {
                      const freshRooms = await portalStore.syncRoomsFromCloud();
                      const avail = (freshRooms || portalStore.getRooms()).filter(r => r.status === 'available').length;
                      setLiveAvailableCount(avail);
                      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                    } catch (e) {}
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Force Live Cloud Sync"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Amira AI Concierge"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Security & Live Brain Sync Banner */}
            <div className="px-3 py-1.5 bg-[#090105] border-b border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#d4af37]" title={`Last client-side brain refresh: ${lastSyncTime}`}>
                <ShieldCheck size={12} />
                <span>Amira Live Brain Sync</span>
              </span>
              <span className="font-mono text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{liveAvailableCount} Suites Ready</span>
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-md ${
                        isAi
                          ? 'bg-[#1e040f] border border-[#d4af37]/30 text-gray-200'
                          : 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-medium'
                      }`}
                    >
                      {/* Format markdown-like bold text and bullet points */}
                      <div className="space-y-1.5 whitespace-pre-wrap">
                        {msg.text.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="text-xs">
                            {paragraph.split('**').map((chunk, cIdx) => 
                              cIdx % 2 === 1 ? <strong key={cIdx} className={isAi ? "text-[#f3e5ab] font-bold" : "font-extrabold"}>{chunk}</strong> : chunk
                            )}
                          </p>
                        ))}
                      </div>
                    </div>

                    <span className="text-[9px] text-gray-500 px-1 font-mono">
                      {isAi ? `Amira • ${msg.timestamp}` : msg.timestamp}
                    </span>

                    {/* Suggestion Chips */}
                    {isAi && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[90%]">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#5c0725] text-[#f3e5ab] text-[10px] font-medium border border-[#d4af37]/30 transition-all text-left flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <span>{sug}</span>
                            <ChevronRight size={10} className="text-[#d4af37]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#1e040f] border border-white/10 text-gray-400 w-fit">
                  <span className="text-[10px] font-medium text-[#f3e5ab]">Amira is checking hotel database</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box Footer */}
            <div className="p-3 bg-[#090105] border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask Amira about rooms, rates, code (ARS-BGD-7812)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                  title="Send Message to Amira"
                >
                  <Send size={13} className="stroke-[2.5]" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] text-gray-500 mt-1.5 px-1">
                <span>Hotline: 0812 578 6875</span>
                <span>Amira AI • Built by <a href="https://kinggold-one.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline">Microbase</a></span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
