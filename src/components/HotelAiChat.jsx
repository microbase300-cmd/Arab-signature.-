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
      text: "Warm greetings and welcome to **Arab Signature Hotel & Suites**, Nsugbe, Onitsha! 👑\n\nI am your live AI Concierge. I can assist you with:\n• Checking **live room availability** right now\n• Securely tracking your **booking reference** (e.g. `ASH-7812`)\n• Suite pricing, directions to Nsugbe, or Al-Sultan dining menus.\n\nHow may I assist your stay today?",
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

  // Start 10-second Client-Side AI Brain Auto-Refresh + Instant Portal Listeners (0 Vercel cost)
  useEffect(() => {
    const syncAiState = () => {
      const brain = hotelAiEngine.refreshBrain();
      const avail = brain.availableRooms.length;
      setLiveAvailableCount(avail);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (prevAvailCountRef.current !== avail) {
        prevAvailCountRef.current = avail;
        // Automatically update any existing availability message in the chat stream so it's never stale
        const updatedAvailResponse = hotelAiEngine.buildAvailabilityResponse(brain);
        setMessages(prev => prev.map(msg => {
          if (msg.sender === 'ai' && (msg.isAvailabilityMsg || msg.text.includes('Live Receptionist Portal Availability'))) {
            return {
              ...msg,
              text: updatedAvailResponse.text,
              suggestions: updatedAvailResponse.suggestions,
              isAvailabilityMsg: true,
              timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Auto-Synced`
            };
          }
          return msg;
        }));
      }
    };

    const stopBrainTimer = hotelAiEngine.startBrainAutoRefresh(10000);
    const unsubscribeRooms = portalStore.subscribeRooms(() => {
      syncAiState();
    });
    window.addEventListener('ash_ai_brain_refreshed', syncAiState);

    return () => {
      stopBrainTimer();
      unsubscribeRooms();
      window.removeEventListener('ash_ai_brain_refreshed', syncAiState);
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
            text: "Opening our secure direct reservation window for you now. You can choose your suite dates and complete instant Paystack checkout.",
            suggestions: ["Check Available Suites", "Track My Booking"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // Process with AI Engine
    setTimeout(() => {
      const response = hotelAiEngine.processQuery(text);
      const brain = hotelAiEngine.getBrainState();
      setLiveAvailableCount(brain.availableRooms.length);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: response.text,
          isAvailabilityMsg: !!response.isAvailabilityMsg,
          suggestions: response.suggestions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 350);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 1. Floating AI Concierge Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#5c0725] via-[#7d0a33] to-[#420317] border-2 border-[#d4af37] text-white shadow-2xl shadow-black/80 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
          title="Chat with Arab Signature Hotel AI Concierge"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/60 bg-[#120208] flex-shrink-0">
            <img src="/logo.jpg" alt="Option 1 Logo" className="w-full h-full object-cover scale-110" />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#120208] animate-ping" />
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#f3e5ab] tracking-wider uppercase">
              <Sparkles size={11} className="text-[#d4af37]" />
              <span>AI Concierge</span>
            </div>
            <span className="text-[10px] text-gray-300">{liveAvailableCount} Suites Ready</span>
          </div>
        </button>
      )}

      {/* 2. Interactive AI Concierge Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#14020a]/95 border border-[#d4af37]/50 rounded-3xl shadow-2xl shadow-black flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 font-sans">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210] border-b border-[#d4af37]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#d4af37]/60 bg-[#120208] shadow-md flex-shrink-0">
                <img src="/logo.jpg" alt="Option 1 Monogram" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-cinzel font-bold text-sm text-[#f3e5ab] tracking-wide">
                    Arab Signature AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold border border-emerald-500/30">
                    10s Auto-Sync
                  </span>
                </div>
                <p className="text-[10px] text-gray-300">
                  Concierge • Nsugbe, Onitsha
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const brain = hotelAiEngine.refreshBrain();
                  setLiveAvailableCount(brain.availableRooms.length);
                  setMessages([
                    {
                      id: "welcome-reset",
                      sender: "ai",
                      text: `AI Brain refreshed (${brain.availableRooms.length} of ${brain.rooms.length} suites currently available). How may I assist your reservation or stay today?`,
                      suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe"],
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Refresh AI Brain & Reset Chat"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close AI Concierge"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Security & Live Brain Sync Banner */}
          <div className="px-3 py-1.5 bg-[#090105] border-b border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[#d4af37]" title={`Last client-side brain refresh: ${lastSyncTime}`}>
              <ShieldCheck size={12} />
              <span>Client Brain Sync (10s)</span>
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
                    {msg.timestamp}
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
                <span className="text-[10px] font-medium text-[#f3e5ab]">Concierge checking hotel database</span>
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
                placeholder="Ask about rooms, code (e.g. ASH-7812)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                title="Send Message"
              >
                <Send size={13} className="stroke-[2.5]" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[9px] text-gray-500 mt-1.5 px-1">
              <span>Hotline: 0812 578 6875</span>
              <span>Lightweight AI • Zero-Server Cost</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
