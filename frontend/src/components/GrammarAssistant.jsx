import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Wand2, Loader2 } from 'lucide-react';

const GrammarAssistant = ({ selection, position, onApply, onDismiss, socket }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleGrammarFixed = (data) => {
        if (data.original === selection) {
          setSuggestion(data.suggestion);
          setLoading(false);
        }
      };

      socket.on('grammar-fixed', handleGrammarFixed);
      return () => socket.off('grammar-fixed', handleGrammarFixed);
    }
  }, [socket, selection]);

  const handleFix = () => {
    setLoading(true);
    setError(false);
    socket.emit('fix-grammar', { text: selection });
  };

  if (!selection || !position) return null;

  return (
    <div 
      className="fixed z-[60] animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        top: position.top - 60, 
        left: position.left,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="glass rounded-2xl shadow-2xl border-[var(--glass-border)] p-2 flex items-center space-x-2 min-w-max shadow-xl shadow-[var(--accent-soft)]">
        {!suggestion && !loading && (
          <button 
            onClick={handleFix}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-xl text-xs font-extrabold transition-all shadow-lg shadow-[var(--accent-soft)] group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500" />
            <span>Magic Fix</span>
          </button>
        )}

        {loading && (
          <div className="flex items-center space-x-2 px-4 py-2 text-[var(--accent)] rounded-xl text-xs font-extrabold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Polishing Brilliance...</span>
          </div>
        )}

        {suggestion && !loading && (
          <>
            <div className="px-3 py-2 bg-[var(--bg-main)]/80 rounded-xl border border-[var(--border)] max-w-xs ring-1 ring-[var(--accent)]/10">
              <p className="text-[8px] text-[var(--accent)] uppercase font-extrabold mb-0.5 tracking-widest text-center">AI Suggestion</p>
              <p className="text-xs text-[var(--text-main)] font-bold italic">"{suggestion}"</p>
            </div>
            <button 
              onClick={() => onApply(suggestion)}
              className="p-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-xl transition-colors shadow-lg shadow-[var(--accent-soft)]"
              title="Apply suggestion"
            >
              <Check className="w-4 h-4" />
            </button>
          </>
        )}

        <button 
          onClick={onDismiss}
          className="p-2 bg-[var(--bg-card)] hover:bg-[var(--accent-soft)] text-[var(--text-dim)] rounded-xl transition-colors border border-[var(--border)]"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Little arrow pointing down */}
      <div className="w-3 h-3 bg-[var(--bg-main)] border-r border-b border-[var(--border)] rotate-45 mx-auto -mt-1.5 shadow-sm" />
    </div>
  );
};

export default GrammarAssistant;
