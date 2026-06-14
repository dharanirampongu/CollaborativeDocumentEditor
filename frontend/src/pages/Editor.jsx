import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { ChevronLeft, Save, Users, Cloud, CloudOff, Info, Share2 } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ShareModal from '../components/ShareModal';
import PollSidebar from '../components/PollSidebar';
import ActivitySidebar from '../components/ActivitySidebar';
import GrammarAssistant from '../components/GrammarAssistant';
import RemoteCursor from '../components/RemoteCursor';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Zap } from 'lucide-react';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPollSidebarOpen, setIsPollSidebarOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectionContext, setSelectionContext] = useState('');
  const [selectionText, setSelectionText] = useState('');
  const [selectionPos, setSelectionPos] = useState(null);
  const [showGrammarAssist, setShowGrammarAssist] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [error, setError] = useState('');
  const { user } = useAuth();
  const socketRef = useRef();
  const timerRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    // 1. Fetch initial document data
    const fetchDoc = async () => {
      try {
        const { data } = await api.get(`/docs/${id}`);
        setDocument(data);
        setContent(data.content || '');
        setPolls(data.polls || []);
        setActivities(data.activities || []);
      } catch (err) {
        setError('Document not found or access denied');
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();

    // 2. Initialize Socket.io
    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-document', id);
    });

    socketRef.current.on('receive-changes', (newContent) => {
      setContent(newContent);
    });

    socketRef.current.on('activity-updated', (newActivity) => {
      setActivities(prev => [...prev, newActivity]);
    });

    socketRef.current.on('poll-created', (newPoll) => {
      setPolls(prev => [...prev, newPoll]);
    });

    socketRef.current.on('poll-updated', (updatedPoll) => {
      setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p));
    });

    socketRef.current.on('poll-resolved', (resolvedPoll) => {
      setPolls(prev => prev.map(p => p._id === resolvedPoll._id ? resolvedPoll : p));
    });

    socketRef.current.on('cursor-update', (data) => {
      setRemoteCursors(prev => ({
        ...prev,
        [data.userId]: data
      }));
    });

    socketRef.current.on('user-left', (id) => {
      setRemoteCursors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  // Handle local changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Emit changes to others
    socketRef.current.emit('send-changes', {
      documentId: id,
      content: newContent,
    });

    // Auto-save logic (debounced)
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaving(true);
    timerRef.current = setTimeout(() => {
      socketRef.current.emit('save-document', {
        documentId: id,
        content: newContent,
        userId: user._id,
      });
      setSaving(false);
    }, 2000);
  };

  // Selection handler to capture context for polls and grammar assistant
  const handleSelect = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const selectedText = e.target.value.substring(start, end);
    
    // Calculate precise coordinates using mirror div approach
    const pos = getCursorXY(e.target, start);
    
    if (socketRef.current) {
      socketRef.current.emit('cursor-move', {
        documentId: id,
        cursorData: {
          username: user?.username || 'Guest',
          position: pos,
          selectionText: selectedText,
          color: user?.color || '#3b82f6' // Default blue if not set
        }
      });
    }

    if (selectedText.trim()) {
      setSelectionContext(selectedText);
      setSelectionText(selectedText);
      setSelectionPos(pos);
      setShowGrammarAssist(true);
    } else {
      setShowGrammarAssist(false);
    }
  };

  // Helper to get X/Y coordinates of a character index in textarea
  const getCursorXY = (element, index) => {
    const { top, left } = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    
    // Create mirror div to measure
    const mirror = document.createElement('div');
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.style.width = element.clientWidth + 'px';
    mirror.style.font = styles.font;
    mirror.style.padding = styles.padding;
    mirror.style.lineHeight = styles.lineHeight;
    mirror.style.fontFamily = styles.fontFamily;
    mirror.style.fontSize = styles.fontSize;
    mirror.style.fontWeight = styles.fontWeight;
    
    const textBefore = element.value.substring(0, index);
    const textAfter = element.value.substring(index);
    
    const span = document.createElement('span');
    span.textContent = element.value.substring(index, index + 1) || '.';
    
    mirror.textContent = textBefore;
    mirror.appendChild(span);
    document.body.appendChild(mirror);
    
    const spanRect = span.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();
    
    document.body.removeChild(mirror);
    
    return {
      top: spanRect.top - mirrorRect.top + element.offsetTop,
      left: spanRect.left - mirrorRect.left + element.offsetLeft
    };
  };

  const handleApplyGrammar = (suggestion) => {
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent = content.substring(0, start) + suggestion + content.substring(end);
    
    setContent(newContent);
    setShowGrammarAssist(false);
    
    // Trigger save and broadcast
    socketRef.current.emit('send-changes', {
      documentId: id,
      content: newContent,
    });
    
    socketRef.current.emit('save-document', {
      documentId: id,
      content: newContent,
      userId: user._id,
    });
  };

  const handleDismissGrammar = () => {
    setShowGrammarAssist(false);
  };

  // Poll handlers
  const handleCreatePoll = (pollData) => {
    socketRef.current.emit('create-poll', {
      documentId: id,
      poll: { ...pollData, createdBy: user._id }
    });
  };

  const handleVotePoll = (pollId, optionIndex) => {
    socketRef.current.emit('vote-poll', {
      documentId: id,
      pollId,
      optionIndex,
      userId: user._id
    });
  };

  const handleResolvePoll = (pollId, winnerIndex) => {
    socketRef.current.emit('resolve-poll', {
      documentId: id,
      pollId,
      winnerIndex
    });
  };

  if (loading) return <Loader fullScreen />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-red-50 p-6 rounded-xl text-center max-w-sm">
        <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen text-[var(--text-main)]">
      {/* Editor Header */}
      <header className="glass border-b border-[var(--glass-border)] flex items-center justify-between px-6 h-16 sticky top-0 z-10 shadow-lg shadow-[var(--accent-soft)]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-[var(--accent-soft)] rounded-full transition-colors text-[var(--text-dim)] hover:text-[var(--text-main)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold text-[var(--text-main)] truncate max-w-[150px] sm:max-w-md">
              {document?.title}
            </h1>
            <div className="flex items-center space-x-2 text-[9px] uppercase tracking-widest font-bold">
              {saving ? (
                <span className="flex items-center text-amber-500">
                  <CloudOff className="w-3 h-3 mr-1" /> Saving...
                </span>
              ) : (
                <span className="flex items-center text-[var(--accent)]">
                  <Cloud className="w-3 h-3 mr-1" /> All saved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center -space-x-2 mr-4 overflow-hidden">
            {/* Current User */}
            <div 
              title={`${user?.username} (You)`}
              className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)] bg-[var(--accent)] flex items-center justify-center text-[10px] font-extrabold text-white shadow-lg ring-2 ring-[var(--accent-soft)] z-30 cursor-help"
            >
              {user?.username.charAt(0).toUpperCase()}
            </div>

            {/* Online Remote Users */}
            {Object.values(remoteCursors).map((rc, idx) => (
              <div 
                key={idx}
                title={`${rc.username} (Online)`}
                className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)] flex items-center justify-center text-[10px] font-extrabold text-white shadow-lg ring-2 ring-[var(--accent-soft)] z-20 cursor-help transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: rc.color || '#0ea5e9' }}
              >
                {rc.username.charAt(0).toUpperCase()}
              </div>
            ))}

            {/* Inactive Collaborators (Mocked/Filtered) */}
            {document?.collaborators?.filter(c => !Object.values(remoteCursors).some(rc => rc.username === c.username)).slice(0, 3).map((collab, idx) => (
              <div 
                key={collab._id}
                title={`${collab.username} (Offline)`}
                className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)] bg-[var(--bg-card)] flex items-center justify-center text-[10px] font-bold text-[var(--text-dim)] shadow-sm ring-1 ring-[var(--border)] opacity-40 z-10 grayscale-[50%]"
              >
                {collab.username.charAt(0).toUpperCase()}
              </div>
            ))}

            {/* Overflow */}
            {document?.collaborators?.length > 5 && (
              <div className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)] bg-[var(--bg-card)] flex items-center justify-center text-[8px] font-bold text-[var(--text-dim)] shadow-sm ring-1 ring-[var(--border)] z-0">
                +{document.collaborators.length - 5}
              </div>
            )}
          </div>
          
          <Button 
            variant="secondary" 
            className={`flex items-center space-x-2 py-2 transition-all ${isPollSidebarOpen ? 'bg-[var(--accent-soft)] border-[var(--accent)]/50 text-[var(--accent)]' : ''}`}
            onClick={() => setIsPollSidebarOpen(!isPollSidebarOpen)}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Polls</span>
            {polls.filter(p => p.status === 'open').length > 0 && (
              <span className="ml-1 bg-[var(--accent)] text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse font-bold">
                {polls.filter(p => p.status === 'open').length}
              </span>
            )}
          </Button>

          <Button 
            variant="secondary" 
            className={`flex items-center space-x-2 py-2 transition-all ${isActivitySidebarOpen ? 'bg-[var(--accent-soft)] border-[var(--accent)]/50 text-[var(--accent)]' : ''}`}
            onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
            {activities.length > 0 && (
              <span className="ml-1 bg-[var(--accent)] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                {activities.length}
              </span>
            )}
          </Button>

          <Button 
            variant="secondary" 
            className="flex items-center space-x-2 py-2 hidden lg:flex"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Members</span>
          </Button>
          
          <Button 
            className="flex items-center space-x-2 py-2 shadow-xl shadow-[var(--accent-soft)]"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </header>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentId={id}
        ownerId={document?.owner}
        collaborators={document?.collaborators || []}
        onUpdate={(newCollaborators) => {
          setDocument({ ...document, collaborators: newCollaborators });
        }}
      />

      {/* Editor Body */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 relative">
        <div className="max-w-5xl mx-auto h-full flex flex-col glass rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* Remote Cursors Overlay */}
          {Object.values(remoteCursors).map((cur) => (
            <RemoteCursor 
              key={cur.userId}
              username={cur.username}
              color={cur.color}
              position={cur.position}
              selectionText={cur.selectionText}
            />
          ))}

          <textarea
            ref={textareaRef}
            className="flex-grow w-full p-8 sm:p-12 resize-none focus:outline-none bg-transparent text-[var(--text-main)] text-lg leading-relaxed font-serif placeholder-[var(--text-dim)] selection:bg-[var(--accent-soft)]"
            placeholder="Start typing your brilliance here..."
            value={content}
            onChange={handleContentChange}
            onSelect={handleSelect}
          />
          <div className="bg-[var(--bg-main)]/50 px-8 py-3 border-t border-[var(--border)] flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-[var(--text-dim)]">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full mr-2 shadow-[0_0_8px_var(--accent)]"></span>
              {content.length} characters
            </span>
            <span className="flex items-center">
              Autosave active <Info className="w-3 h-3 ml-1 text-[var(--text-dim)]/50" />
            </span>
          </div>
        </div>
      </main>

      {/* Decision Polls Sidebar */}
      <PollSidebar 
        isOpen={isPollSidebarOpen}
        onClose={() => setIsPollSidebarOpen(false)}
        polls={polls}
        onVote={handleVotePoll}
        onResolve={handleResolvePoll}
        onCreatePoll={handleCreatePoll}
        currentUserId={user?._id}
        selectionContext={selectionContext}
      />

      {/* Contextual AI Activity Sidebar */}
      <ActivitySidebar 
        isOpen={isActivitySidebarOpen}
        onClose={() => setIsActivitySidebarOpen(false)}
        activities={activities}
      />

      {/* AI Grammar Assistant (Floating) */}
      {showGrammarAssist && (
        <GrammarAssistant 
          selection={selectionText}
          position={selectionPos}
          onApply={handleApplyGrammar}
          onDismiss={handleDismissGrammar}
          socket={socketRef.current}
        />
      )}
    </div>
  );
};

export default Editor;
