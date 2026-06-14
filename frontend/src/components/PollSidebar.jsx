import React, { useState } from 'react';
import { X, Send, Plus, CheckCircle2, User, Clock, Trash2 } from 'lucide-react';
import Button from './Button';

const PollItem = ({ poll, onVote, onResolve, currentUserId }) => {
  const isOwner = poll.createdBy === currentUserId || (poll.createdBy?._id === currentUserId);
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
  const hasVoted = poll.options.some(opt => opt.votes.includes(currentUserId));

  return (
    <div className={`p-4 rounded-3xl border ${poll.status === 'resolved' ? 'bg-[var(--bg-main)]/40 border-[var(--border)] opacity-75' : 'glass border-[var(--glass-border)] shadow-xl'} mb-4 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-extrabold text-[var(--text-main)] text-sm leading-tight">{poll.question}</h3>
        {poll.status === 'resolved' && (
          <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 ml-2" />
        )}
      </div>
      
      <div className="text-[10px] text-[var(--text-dim)] mb-4 flex items-center space-x-2 font-bold uppercase tracking-widest">
        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(poll.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span>•</span>
        <span>{totalVotes} total votes</span>
      </div>

      <div className="space-y-2">
        {poll.options.map((option, idx) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
          const isWinner = poll.status === 'resolved' && poll.winner === idx;
          const userVotedForThis = option.votes.includes(currentUserId);

          return (
            <div key={idx} className="relative">
              <button
                disabled={poll.status === 'resolved'}
                onClick={() => onVote(poll._id, idx)}
                className={`w-full text-left p-3 rounded-xl text-xs relative z-10 border transition-all ${
                  isWinner 
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-extrabold' 
                    : userVotedForThis
                    ? 'border-sky-500/50 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/30 bg-[var(--bg-main)]/50 text-[var(--text-main)]'
                }`}
              >
                <div className="flex justify-between items-center relative z-10">
                  <span className="truncate pr-8">{option.text}</span>
                  <span className="font-extrabold opacity-80">{percentage}%</span>
                </div>
                
                {/* Progress bar background */}
                {totalVotes > 0 && (
                  <div 
                    className={`absolute left-0 top-0 bottom-0 rounded-xl transition-all duration-700 ease-out z-0 ${
                      isWinner ? 'bg-[var(--accent)]/10' : userVotedForThis ? 'bg-sky-500/10' : 'bg-[var(--text-main)]/5'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {isOwner && poll.status === 'open' && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
          <Button 
            variant="secondary" 
            className="text-[10px] py-1 px-3"
            onClick={() => {
              // Find index of option with most votes
              let maxVotes = -1;
              let winnerIdx = 0;
              poll.options.forEach((opt, i) => {
                if (opt.votes.length > maxVotes) {
                  maxVotes = opt.votes.length;
                  winnerIdx = i;
                }
              });
              onResolve(poll._id, winnerIdx);
            }}
          >
            <CheckCircle2 className="w-3 h-3 text-[var(--accent)] mr-1" />
            <span>Apply Winner</span>
          </Button>
        </div>
      )}
      
      {poll.status === 'resolved' && (
        <div className="mt-2 text-[10px] text-[var(--text-dim)] italic font-bold">
          Resolved: Winning text applied to document
        </div>
      )}
    </div>
  );
};

const PollSidebar = ({ isOpen, onClose, polls, onVote, onResolve, onCreatePoll, currentUserId, selectionContext }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt)) return;
    
    onCreatePoll({
      question,
      context: selectionContext || '',
      options: options.map(text => ({ text, votes: [] })),
      createdBy: currentUserId,
      status: 'open'
    });
    
    setQuestion('');
    setOptions(['', '']);
    setIsCreating(false);
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full glass shadow-2xl transition-all duration-300 z-50 overflow-hidden flex flex-col ${
        isOpen ? 'w-80 border-l border-[var(--glass-border)]' : 'w-0 border-none'
      }`}
    >
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]/80 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-extrabold text-[var(--text-main)]">Decision Polls</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[var(--accent-soft)] rounded-full transition-colors">
          <X className="w-5 h-5 text-[var(--text-dim)]" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[var(--bg-main)]/30">
        {!isCreating && (
          <Button 
            className="w-full mb-6 py-4 flex items-center justify-center space-x-2 text-sm shadow-xl shadow-[var(--accent-soft)]"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New Writing Poll</span>
          </Button>
        )}

        {isCreating && (
          <div className="glass p-5 rounded-3xl border-[var(--accent)]/10 shadow-xl mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-extrabold mb-4">Create New Poll</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1 tracking-widest">Question/Goal</label>
                <input 
                  type="text" 
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="e.g. Which version is clearer?"
                  className="w-full p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/50 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all placeholder-[var(--text-dim)]/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1 tracking-widest">Options</label>
                {options.map((opt, idx) => (
                  <input 
                    key={idx}
                    type="text" 
                    value={opt}
                    onChange={e => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="w-full p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/50 text-xs text-[var(--text-main)] focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all placeholder-[var(--text-dim)]/50"
                    required
                  />
                ))}
                {options.length < 4 && (
                  <button 
                    type="button" 
                    onClick={() => setOptions([...options, ''])}
                    className="text-[10px] text-[var(--accent)] font-extrabold hover:opacity-80 flex items-center space-x-1 mt-1 px-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              {selectionContext && (
                <div className="p-3 bg-[var(--accent-soft)]/20 rounded-xl border border-[var(--accent)]/10">
                  <span className="block text-[8px] uppercase font-bold text-[var(--accent)] mb-1">Context Highlighted:</span>
                  <p className="text-[10px] text-[var(--text-dim)] line-clamp-2 italic italic">"{selectionContext}"</p>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="secondary" 
                  className="flex-grow py-2 text-xs" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-grow py-2 text-xs"
                >
                  Launch Poll
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase font-bold text-[var(--text-dim)] mb-2 tracking-widest">Active Polls ({polls.filter(p => p.status === 'open').length})</h4>
          {polls.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-[var(--text-dim)]/30" />
              </div>
              <p className="text-xs text-[var(--text-dim)] font-bold">No polls yet. Highlight text to start one!</p>
            </div>
          ) : (
            polls.map((poll, idx) => (
              <PollItem 
                key={poll._id || idx} 
                poll={poll} 
                onVote={onVote} 
                onResolve={onResolve}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollSidebar;
