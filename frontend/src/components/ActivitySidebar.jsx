import React from 'react';
import { X, Zap, Clock, User, MessageSquare } from 'lucide-react';

const ActivityItem = ({ activity }) => {
  return (
    <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/50 mb-3 shadow-lg transition-all hover:bg-[var(--bg-main)] hover:border-[var(--accent)]/30 animate-in fade-in slide-in-from-right-4 group">
      <div className="flex items-start space-x-3">
        <div className="mt-1 p-1.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] group-hover:border-[var(--accent)]/30 transition-colors">
          <Zap className="w-3 h-3 text-[var(--accent)]" />
        </div>
        <div className="flex-grow">
          <p className="text-xs text-[var(--text-main)] leading-relaxed font-bold">
            {activity.text}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded-lg text-[8px] border border-[var(--accent)]/20">
              AI Insight
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivitySidebar = ({ isOpen, onClose, activities }) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-full glass shadow-2xl transition-all duration-300 z-50 overflow-hidden flex flex-col ${
        isOpen ? 'w-80 border-l border-[var(--glass-border)]' : 'w-0 border-none'
      }`}
    >
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]/80 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-extrabold text-[var(--text-main)]">Contextual Activity</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[var(--accent-soft)] rounded-full transition-colors">
          <X className="w-5 h-5 text-[var(--text-dim)]" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[var(--bg-main)]/30">
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-2 tracking-widest">Editor Insights ({activities.length})</h4>
          
          {activities.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-[var(--text-dim)]/30" />
              </div>
              <h5 className="text-sm font-bold text-[var(--text-dim)] mb-1">Silence is Golden</h5>
              <p className="text-[10px] text-[var(--text-dim)]">No major edits summarized yet. Keep writing and AI will provide insights!</p>
            </div>
          ) : (
            [...activities].reverse().map((activity, idx) => (
              <ActivityItem key={activity._id || idx} activity={activity} />
            ))
          )}
        </div>
      </div>
      
      <div className="p-6 bg-[var(--bg-main)] border-t border-[var(--border)]">
        <div className="bg-[var(--accent-soft)]/20 rounded-2xl p-4 border border-[var(--accent)]/10">
          <p className="text-[10px] text-[var(--accent)]/80 italic leading-snug font-bold">
            "AI summarizes changes in real-time to help your team stay synchronized without reading every keystroke."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivitySidebar;
