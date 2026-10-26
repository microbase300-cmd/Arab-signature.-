/**
 * 100% Client-Side Voice AI Assistant Engine for "Amira"
 * Powered entirely by standard browser Web Speech API (SpeechRecognition + SpeechSynthesis)
 * 
 * ZERO SERVER INVOCATIONS:
 * - 0 Vercel Serverless Function invocations
 * - 0 Third-Party Cloud Audio APIs
 * - 0 Backend Server CPU / RAM consumption
 * - Runs 100% locally inside the user's browser (Chrome, Edge, Safari, Android)
 */

class ClientVoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListeningActive = false;
    this.isSpeakingActive = false;
    this.selectedVoice = null;
    this.voicesLoaded = false;
    this.currentUtterance = null;
    
    // Auto-detect speech synthesis voices when browser loads them
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  /**
   * Check if Speech Recognition (Mic Input) is supported in current browser
   */
  isRecognitionSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Check if Speech Synthesis (Voice Output) is supported in current browser
   */
  isSynthesisSupported() {
    if (typeof window === 'undefined') return false;
    return Boolean('speechSynthesis' in window && window.SpeechSynthesisUtterance);
  }

  /**
   * Load and select the best available natural female/concierge voice
   */
  initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      this.voicesLoaded = true;

      // Priority preference: Natural / Female English voices
      const preferredNames = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Jenny',
        'Microsoft Zira',
        'Samantha',
        'Victoria',
        'Karen',
        'Moira',
        'Fiona'
      ];

      // 1. Check preferred names
      for (const name of preferredNames) {
        const found = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
        if (found) {
          this.selectedVoice = found;
          return;
        }
      }

      // 2. Check any female English voice
      const femaleEnglish = voices.find(v => 
        (v.lang.startsWith('en') || v.lang.startsWith('en-')) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
      );
      if (femaleEnglish) {
        this.selectedVoice = femaleEnglish;
        return;
      }

      // 3. Fallback to any English voice
      const anyEnglish = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('en-'));
      if (anyEnglish) {
        this.selectedVoice = anyEnglish;
        return;
      }

      // 4. Default system voice
      this.selectedVoice = voices[0];
    } catch (e) {
      console.warn('[Voice Assistant] Voice initialization note:', e);
    }
  }

  /**
   * Clean markdown asterisks, emojis, bullet points, and code formatting
   * to ensure speech synthesis sounds polished, natural and professional.
   */
  cleanTextForSpeech(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';

    return rawText
      // Remove URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove markdown bold / italic (* or _)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove inline code ticks
      .replace(/`([^`]+)`/g, '$1')
      // Remove markdown bullet points
      .replace(/^[•\-\*]\s+/gm, '')
      // Replace hotel code formatting for smooth reading (e.g. ARS-BGD-7812AB -> A R S B G D)
      .replace(/ARS-([A-Z]+)-([0-9A-Z]+)/g, 'booking code $1 $2')
      .replace(/ARB-FDD-([0-9A-Z]+)/g, 'food order $1')
      .replace(/ARB-DRK-([0-9A-Z]+)/g, 'drink order $1')
      // Replace currency symbol with spoken Naira
      .replace(/₦\s*([0-9,]+)/g, '$1 Naira')
      // Remove emojis
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
      // Collapse multiple whitespaces and trim
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Start Speech Recognition (Voice Input / Microphone)
   * 100% in-browser processing via Web Speech API
   */
  startListening({ onResult, onInterim, onError, onEnd, lang = 'en-US' } = {}) {
    if (!this.isRecognitionSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    // Stop speech synthesis if speaking so mic doesn't hear Amira
    this.stopSpeaking();

    // Abort any existing recognition session
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = lang;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = false; // Automatically stops on sentence pause

    this.isListeningActive = true;

    let finalTranscript = '';

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      if (onInterim && interim) {
        onInterim(interim);
      }

      if (finalTranscript) {
        if (onResult) onResult(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      this.isListeningActive = false;
      const errorType = event.error || 'unknown';
      console.warn('[Voice Assistant] Recognition error:', errorType);
      
      let humanMessage = 'Could not capture voice audio.';
      if (errorType === 'not-allowed' || errorType === 'permission-denied') {
        humanMessage = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (errorType === 'no-speech') {
        humanMessage = 'No speech detected. Please tap the microphone and speak again.';
      } else if (errorType === 'network') {
        humanMessage = 'Network error during voice recognition.';
      }

      if (onError) onError(humanMessage, errorType);
    };

    this.recognition.onend = () => {
      this.isListeningActive = false;
      if (onEnd) onEnd(finalTranscript ? finalTranscript.trim() : '');
    };

    try {
      this.recognition.start();
      return true;
    } catch (startErr) {
      console.warn('[Voice Assistant] Recognition start error:', startErr);
      this.isListeningActive = false;
      if (onError) onError('Could not activate microphone.');
      return false;
    }
  }

  /**
   * Stop Speech Recognition
   */
  stopListening() {
    this.isListeningActive = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  /**
   * Speak text out loud using native browser speech synthesis
   * 100% client-side, zero server overhead
   */
  speakText(text, { onStart, onEnd, onError, rate = 1.0, pitch = 1.05 } = {}) {
    if (!this.isSynthesisSupported()) {
      if (onError) onError('Voice synthesis is not supported on this device.');
      return false;
    }

    // Cancel any currently playing speech
    this.stopSpeaking();

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return false;

    // Refresh voices if not yet cached
    if (!this.selectedVoice) {
      this.initVoices();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = rate; // Natural conversational speed
      utterance.pitch = pitch; // Elegant, friendly concierge tone

      utterance.onstart = () => {
        this.isSpeakingActive = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeakingActive = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeakingActive = false;
        this.currentUtterance = null;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('[Voice Assistant] Speech synthesis error:', err);
      this.isSpeakingActive = false;
      if (onError) onError(err);
      return false;
    }
  }

  /**
   * Stop any active Speech Synthesis
   */
  stopSpeaking() {
    this.isSpeakingActive = false;
    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  /**
   * Get current voice status
   */
  getStatus() {
    return {
      isRecognitionSupported: this.isRecognitionSupported(),
      isSynthesisSupported: this.isSynthesisSupported(),
      isListening: this.isListeningActive,
      isSpeaking: this.isSpeakingActive,
      selectedVoiceName: this.selectedVoice ? this.selectedVoice.name : 'System Default'
    };
  }
}

export const clientVoiceAssistant = new ClientVoiceAssistant();
