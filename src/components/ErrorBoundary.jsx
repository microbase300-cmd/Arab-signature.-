import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReturnHome = () => {
    window.location.hash = '';
    window.location.pathname = '/';
  };

  handleResetState = () => {
    try {
      // Clear potentially corrupt session keys if needed
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const fallbackLabel = this.props.fallbackLabel || 'Operations Module';
      const errorMessage = this.state.error?.message || 'An unexpected rendering interruption occurred.';

      return (
        <div className="min-h-screen bg-[#0e0106] text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#d4af37] selection:text-black">
          <div className="w-full max-w-xl bg-gradient-to-b from-[#1c040e] via-[#14020a] to-[#0a0105] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 backdrop-blur-xl text-center space-y-6">
            
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-amber-500/10 border-2 border-[#d4af37]/60 shadow-lg shadow-[#d4af37]/20">
              <ShieldAlert size={32} className="text-[#d4af37]" />
            </div>

            {/* Title & Info */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs font-mono uppercase tracking-wider">
                <AlertTriangle size={12} className="text-amber-400" />
                <span>{fallbackLabel} Protection Guard</span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                Front Desk Session Interruption
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                The portal encountered a transient data render anomaly and was protected from a white/blank crash. Your reservations and inventory remain safely intact.
              </p>
            </div>

            {/* Error Details Accordion */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-[11px] text-red-300/90 break-words max-h-32 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Diagnostic Log:</div>
              {errorMessage}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-black font-cinzel font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} className="stroke-[2.5]" />
                <span>Reload Operations</span>
              </button>
              <button
                onClick={this.handleReturnHome}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 font-cinzel font-semibold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={14} />
                <span>Guest Website</span>
              </button>
            </div>

            <div className="text-[10px] text-gray-500 font-mono">
              Arab Signature Hotel & Suites • Security & Operations Management
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
