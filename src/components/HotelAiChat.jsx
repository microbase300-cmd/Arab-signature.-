import React, { useState, useEffect, useRef } from 'react';
import { hotelAiEngine } from '../utils/hotelAiEngine';
import { portalStore } from '../data/portalStore';
import { clientVoiceAssistant } from '../utils/clientVoiceAssistant';
import { 
  Sparkles, MessageSquare, X, Send, Bot, User, 
  ShieldCheck, BedDouble, ChevronRight, Phone, RefreshCw, Key,
  Mic, MicOff, Volume2, VolumeX, Square, Radio
} from 'lucide-react';

// Feature Flag: Set to false to disable voice features for a lean first launch.
// When ready, simply switch to true to re-enable 100% client-side voice recognition & narration.
const ENABLE_VOICE_ASSISTANT = false;

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

  // 100% Client-Side Voice Assistant States (Dormant when ENABLE_VOICE_ASSISTANT = false)
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('ash_amira_voice_muted') === 'true';
    }
    return false;
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningTranscript, setListeningTranscript] = useState('');
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState(null);
  const [voiceNotice, setVoiceNotice] = useState('');
  const isRecognitionAvailable = typeof window !== 'undefined' && clientVoiceAssistant.isRecognitionSupported();

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Warm royal greetings and welcome to **Arab Signature Hotel & Suites**, Nsugbe, Onitsha! 👑\n\nI am **Amira**, your Royal AI Concierge. I am trained with all hotel knowledge to guide you step by step with:\n• **Step-by-step suite bookings** & Paystack payment\n• **Live suite availability** across Main & Extension Wings\n• **The ₦120,000 Diplomatic Apartment with Parlour** details & photos\n• **Interactive Pool 360° View** & VIP Cabanas\n• **Al-Sultan Restaurant & VIP Bar Lounge Catalog**\n• **Customer Guest Portal (#guest-portal)** to view your digital room key & order in-suite dining\n• **Directions to Nsugbe** from anywhere in Anambra State.\n\nHow may I gracefully assist your stay today?",
      suggestions: [
        "How to Book Step by Step",
        "Check Available Suites",
        "120k Apartment with Parlour",
        "View Pool 360",
        "Dining & Drinks Menu",
        "Directions to Nsugbe"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Client-Side AI Brain Auto-Refresh + Real-Time Event Listeners (Zero Serverless Spam)
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

    // Relaxed 60-second client-side heartbeat (drastically reduces serverless & network usage)
    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        syncCurrentRooms();
      }
    }, 60000);

    // Instant event listeners for real-time room updates across tabs
    const unsubPortal = portalStore.subscribeRooms(() => {
      syncCurrentRooms(true);
    });
    window.addEventListener('ash_rooms_updated', () => syncCurrentRooms(true));
    window.addEventListener('ash_ai_brain_refreshed', () => syncCurrentRooms(true));
    window.addEventListener('storage', () => syncCurrentRooms(true));
    window.addEventListener('focus', () => syncCurrentRooms(true));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) syncCurrentRooms(true);
    });

    return () => {
      clearInterval(intervalId);
      unsubPortal();
      window.removeEventListener('ash_rooms_updated', () => syncCurrentRooms(true));
      window.removeEventListener('ash_ai_brain_refreshed', () => syncCurrentRooms(true));
      window.removeEventListener('storage', () => syncCurrentRooms(true));
      window.removeEventListener('focus', () => syncCurrentRooms(true));
      document.removeEventListener('visibilitychange', () => syncCurrentRooms(true));
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      portalStore.syncRoomsFromCloud().then((cloudRooms) => {
        if (cloudRooms && Array.isArray(cloudRooms)) {
          setLiveAvailableCount(cloudRooms.filter(r => r.status === 'available').length);
        }
      }).catch(() => {});
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Stop listening or prior speech immediately
    clientVoiceAssistant.stopListening();
    setIsListening(false);
    setListeningTranscript('');

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
        const replyText = "I have opened a direct WhatsApp chat with our 24/7 Front Desk Reception in Nsugbe. I am Amira, and I remain right here if you also want to check live suite availability or rates!";
        const aiId = `ai-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            sender: "ai",
            text: replyText,
            suggestions: ["Check Available Suites", "View Suite Rates"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (ENABLE_VOICE_ASSISTANT && !isVoiceMuted && clientVoiceAssistant.isSynthesisSupported()) {
          handleSpeakSingleMessage(aiId, replyText);
        }
      }, 400);
      return;
    }

    // If user clicked a direct reserve action
    if (text.toLowerCase().includes("reserve") || text.toLowerCase().includes("book a suite")) {
      setTimeout(() => {
        setIsTyping(false);
        if (onOpenBooking) onOpenBooking('deluxe');
        const replyText = "I am Amira, your Royal AI Concierge — I have opened our secure direct reservation window for you now. You can choose your suite dates and complete instant Paystack checkout.";
        const aiId = `ai-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            sender: "ai",
            text: replyText,
            suggestions: ["Check Available Suites", "Track My Booking"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (ENABLE_VOICE_ASSISTANT && !isVoiceMuted && clientVoiceAssistant.isSynthesisSupported()) {
          handleSpeakSingleMessage(aiId, replyText);
        }
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

        const aiId = `ai-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            sender: "ai",
            text: response.text,
            isAvailabilityMsg: !!response.isAvailabilityReport,
            suggestions: response.suggestions || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        // 100% Client-Side Voice Speech (Amira Speaks Response when ENABLE_VOICE_ASSISTANT = true)
        if (ENABLE_VOICE_ASSISTANT && !isVoiceMuted && clientVoiceAssistant.isSynthesisSupported()) {
          setCurrentlySpeakingMsgId(aiId);
          setIsSpeaking(true);
          clientVoiceAssistant.speakText(response.text, {
            onStart: () => setIsSpeaking(true),
            onEnd: () => {
              setIsSpeaking(false);
              setCurrentlySpeakingMsgId(null);
            },
            onError: () => {
              setIsSpeaking(false);
              setCurrentlySpeakingMsgId(null);
            }
          });
        }
      } catch (err) {
        console.error("AI chat processing error:", err);
        const fallbackText = "Warm greetings from Arab Signature Hotel. I am Amira, your Royal AI Concierge. How may I assist your stay or reservation today?";
        const aiId = `ai-err-${Date.now()}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            sender: "ai",
            text: fallbackText,
            suggestions: ["Check Available Suites", "Track My Booking", "Directions to Nsugbe"],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (ENABLE_VOICE_ASSISTANT && !isVoiceMuted && clientVoiceAssistant.isSynthesisSupported()) {
          handleSpeakSingleMessage(aiId, fallbackText);
        }
      } finally {
        setIsTyping(false);
      }
    }, 250);
  };

  // Voice Helper Handlers (100% Client-Side)
  const handleToggleListening = () => {
    if (isListening) {
      clientVoiceAssistant.stopListening();
      setIsListening(false);
      setListeningTranscript('');
      return;
    }

    if (!isRecognitionAvailable) {
      setVoiceNotice('Voice input works best in Google Chrome, Microsoft Edge, and Safari.');
      setTimeout(() => setVoiceNotice(''), 4500);
      return;
    }

    // Stop speaking if Amira is talking so mic won't pick her up
    clientVoiceAssistant.stopSpeaking();
    setIsSpeaking(false);
    setCurrentlySpeakingMsgId(null);

    setVoiceNotice('');
    const started = clientVoiceAssistant.startListening({
      onInterim: (interim) => {
        setListeningTranscript(interim);
      },
      onResult: (finalText) => {
        setIsListening(false);
        setListeningTranscript('');
        if (finalText && finalText.trim()) {
          handleSendMessage(finalText.trim());
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setListeningTranscript('');
        setVoiceNotice(errMsg);
        setTimeout(() => setVoiceNotice(''), 4500);
      },
      onEnd: () => {
        setIsListening(false);
        setListeningTranscript('');
      }
    });

    if (started) {
      setIsListening(true);
    }
  };

  const handleToggleVoiceMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ash_amira_voice_muted', String(nextMuted));
    }
    if (nextMuted) {
      clientVoiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      setCurrentlySpeakingMsgId(null);
    }
  };

  const handleSpeakSingleMessage = (msgId, text) => {
    if (isSpeaking && currentlySpeakingMsgId === msgId) {
      clientVoiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      setCurrentlySpeakingMsgId(null);
      return;
    }

    setCurrentlySpeakingMsgId(msgId);
    setIsSpeaking(true);
    clientVoiceAssistant.speakText(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentlySpeakingMsgId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentlySpeakingMsgId(null);
      }
    });
  };

  const handleStopSpeaking = () => {
    clientVoiceAssistant.stopSpeaking();
    setIsSpeaking(false);
    setCurrentlySpeakingMsgId(null);
  };

  const handleCloseChat = () => {
    clientVoiceAssistant.stopSpeaking();
    clientVoiceAssistant.stopListening();
    setIsSpeaking(false);
    setIsListening(false);
    setCurrentlySpeakingMsgId(null);
    setIsOpen(false);
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
            title="Chat with Amira — Royal AI Concierge"
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
                <span>{ENABLE_VOICE_ASSISTANT ? "Amira • Voice AI" : "Amira • AI Concierge"}</span>
              </div>
              <span className="text-[10px] text-gray-300 flex items-center gap-1">
                {ENABLE_VOICE_ASSISTANT && <Mic size={10} className="text-[#d4af37]" />}
                <span>{ENABLE_VOICE_ASSISTANT ? `Voice Enabled • ${liveAvailableCount} Suites` : `${liveAvailableCount} Suites Ready`}</span>
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Interactive Amira AI Concierge Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] flex flex-col items-end gap-2.5 font-sans">
          
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

          <div className="w-full h-[560px] max-h-[82vh] bg-[#14020a]/95 border border-[#d4af37]/50 rounded-3xl shadow-2xl shadow-black flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#420317] via-[#5c0725] to-[#250210] border-b border-[#d4af37]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#d4af37]/60 bg-[#120208] shadow-md flex-shrink-0">
                  <img src="/logo.jpg" alt="Amira Monogram" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-cinzel font-bold text-sm text-[#f3e5ab] tracking-wide">
                      {ENABLE_VOICE_ASSISTANT ? "Amira — Voice AI" : "Amira — Royal AI"}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold border border-emerald-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-300">
                    {ENABLE_VOICE_ASSISTANT ? "Royal AI Concierge • Voice & Text" : "Royal AI Concierge • Nsugbe, Onitsha"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Speaking Waveform Indicator & Stop Button (When Voice Enabled) */}
                {ENABLE_VOICE_ASSISTANT && isSpeaking && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#120208] border border-[#d4af37]/50 text-[#f3e5ab] text-[10px] animate-pulse">
                    <span className="flex items-center gap-0.5 h-2.5">
                      <span className="w-0.5 h-full bg-[#d4af37] animate-pulse" />
                      <span className="w-0.5 h-2 bg-[#f3e5ab] animate-pulse [animation-delay:0.15s]" />
                      <span className="w-0.5 h-full bg-[#d4af37] animate-pulse [animation-delay:0.3s]" />
                    </span>
                    <span className="text-[9px] font-medium hidden sm:inline">Speaking</span>
                    <button
                      onClick={handleStopSpeaking}
                      className="p-0.5 text-gray-400 hover:text-white transition-colors ml-0.5"
                      title="Stop Speaking"
                    >
                      <Square size={9} className="fill-[#f3e5ab]" />
                    </button>
                  </div>
                )}

                {/* Voice Narration Mute/Unmute Toggle (When Voice Enabled) */}
                {ENABLE_VOICE_ASSISTANT && (
                  <button
                    type="button"
                    onClick={handleToggleVoiceMute}
                    className={`p-1.5 rounded-lg transition-colors ${
                      !isVoiceMuted 
                        ? 'text-[#f3e5ab] hover:bg-white/10 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/10'
                    }`}
                    title={!isVoiceMuted ? "Voice Narration: ON (Click to Mute)" : "Voice Narration: MUTED (Click to Enable Speech)"}
                  >
                    {!isVoiceMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                )}

                {/* Force Refresh */}
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

                {/* Close Drawer */}
                <button
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Amira AI Concierge"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Security & Live Brain Sync Banner */}
            <div className="px-3 py-1.5 bg-[#090105] border-b border-white/5 text-[10px] text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[#d4af37]" title={`100% Client-Side Voice Engine (0 Server Cost)`}>
                <ShieldCheck size={12} />
                <span>Client Voice AI Active</span>
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
                const isCurrentlyPlayingThis = isSpeaking && currentlySpeakingMsgId === msg.id;

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

                    <div className="flex items-center gap-1.5 px-1 font-mono text-[9px] text-gray-500">
                      <span>{isAi ? `Amira • ${msg.timestamp}` : msg.timestamp}</span>

                      {/* Listen / Replay Speaker Button on AI Messages (When Voice Enabled) */}
                      {ENABLE_VOICE_ASSISTANT && isAi && (
                        <button
                          type="button"
                          onClick={() => handleSpeakSingleMessage(msg.id, msg.text)}
                          className={`p-1 rounded transition-all flex items-center gap-1 ${
                            isCurrentlyPlayingThis
                              ? 'text-[#f3e5ab] bg-[#5c0725] border border-[#d4af37]/40'
                              : 'text-gray-400 hover:text-[#f3e5ab] hover:bg-white/5'
                          }`}
                          title={isCurrentlyPlayingThis ? "Stop speaking this response" : "Listen to Amira speak this answer"}
                        >
                          {isCurrentlyPlayingThis ? (
                            <span className="flex items-center gap-0.5 h-2 px-0.5">
                              <span className="w-0.5 h-full bg-[#f3e5ab] animate-pulse" />
                              <span className="w-0.5 h-1.5 bg-[#f3e5ab] animate-pulse [animation-delay:0.15s]" />
                              <span className="w-0.5 h-full bg-[#f3e5ab] animate-pulse [animation-delay:0.3s]" />
                            </span>
                          ) : (
                            <Volume2 size={11} />
                          )}
                          <span className="text-[8px] font-sans">{isCurrentlyPlayingThis ? "Playing" : "Listen"}</span>
                        </button>
                      )}
                    </div>

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
              
              {/* Listening Banner & Real-Time Interim Transcript (When Voice Enabled) */}
              {ENABLE_VOICE_ASSISTANT && isListening && (
                <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-[#5c0725] via-[#420317] to-[#14020a] border border-[#d4af37]/50 shadow-lg animate-in fade-in space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[#f3e5ab] font-semibold text-[11px] tracking-wide">
                        Listening to your voice... Speak now
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleListening}
                      className="px-2 py-0.5 rounded-md bg-black/60 text-gray-300 hover:text-white text-[10px] border border-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                  {listeningTranscript && (
                    <p className="text-[11px] text-emerald-300 font-mono italic pl-4 truncate">
                      "{listeningTranscript}"
                    </p>
                  )}
                </div>
              )}

              {/* Voice Notice / Permissions Error (When Voice Enabled) */}
              {ENABLE_VOICE_ASSISTANT && voiceNotice && (
                <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-[11px] flex items-center justify-between animate-in fade-in">
                  <span>{voiceNotice}</span>
                  <button onClick={() => setVoiceNotice('')} className="text-gray-400 hover:text-white ml-2">✕</button>
                </div>
              )}

              {/* Main Input Row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder="Ask Amira about rooms, rates, code (ARS-BGD-7812AB)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={ENABLE_VOICE_ASSISTANT && isListening}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || (ENABLE_VOICE_ASSISTANT && isListening)}
                    className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                    title="Send Message to Amira"
                  >
                    <Send size={13} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* 100% Client-Side Voice Input Microphone Button (When Voice Enabled) */}
                {ENABLE_VOICE_ASSISTANT && (
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center flex-shrink-0 ${
                      isListening
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 border-white text-white shadow-lg shadow-red-500/50 scale-105 animate-pulse'
                        : 'bg-gradient-to-r from-[#5c0725] to-[#420317] border-[#d4af37]/60 text-[#f3e5ab] hover:border-[#d4af37] hover:scale-105 active:scale-95'
                    }`}
                    title={isListening ? "Stop Listening" : "Tap to Speak to Amira (Voice Input)"}
                  >
                    {isListening ? (
                      <MicOff size={15} />
                    ) : (
                      <Mic size={15} />
                    )}
                  </button>
                )}
              </div>

              {/* Subfooter */}
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
