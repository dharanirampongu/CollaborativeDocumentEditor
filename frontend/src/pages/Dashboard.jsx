import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, Trash2, ExternalLink, Search, Filter, Zap } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, owned, shared
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docsRes, activityRes] = await Promise.all([
        api.get('/docs'),
        api.get('/docs/global-activity')
      ]);
      setDocuments(docsRes.data);
      setActivities(activityRes.data);
    } catch (err) {
      setError('Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    try {
      const { data } = await api.post('/docs', {
        title: 'Untitled Document',
        content: '',
      });
      setDocuments([data, ...documents]);
      navigate(`/editor/${data._id}`); // Navigate directly to new doc
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await api.delete(`/docs/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const filteredDocs = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'owned' && doc.owner === user._id) ||
                           (filterType === 'shared' && doc.owner !== user._id);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen text-[var(--text-main)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--text-main)]">My Workspace</h1>
          <p className="text-[var(--text-dim)] mt-2 font-bold flex items-center">
            <Zap className="w-4 h-4 text-[var(--accent)] mr-2" />
            Manage and collaborate on your documents with ease
          </p>
        </div>
        <Button onClick={createDocument} className="flex items-center space-x-2 px-8 py-3 shadow-xl shadow-[var(--accent-soft)]">
          <Plus className="w-5 h-5" />
          <span>New Document</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Toolbar */}
          <div className="glass p-4 rounded-3xl mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xl">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-dim)]" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)]/50 border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none text-[var(--text-main)] placeholder-[var(--text-dim)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-[var(--bg-main)] p-1 rounded-2xl w-full sm:w-auto border border-[var(--border)]">
              {['all', 'owned', 'shared'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filterType === type ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-8 text-sm font-bold border border-red-500/20">
              {error}
            </div>
          )}

          {/* Grid */}
          {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <DocumentCard 
                  key={doc._id} 
                  doc={doc} 
                  onDelete={() => deleteDocument(doc._id)} 
                  isOwner={doc.owner === user._id}
                  onClick={() => navigate(`/editor/${doc._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl border-2 border-dashed border-[var(--border)] py-20 text-center">
              <div className="w-16 h-16 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                <FileText className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <p className="text-[var(--text-dim)] text-lg font-bold">No documents found.</p>
              <button 
                onClick={createDocument}
                className="text-[var(--accent)] font-bold mt-2 hover:opacity-80 underline underline-offset-4 decoration-2"
              >
                Create your first one!
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 shadow-xl border-t-4 border-[var(--accent)]">
            <h2 className="text-lg font-extrabold mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[var(--accent)]" />
              Collaboration News
            </h2>
            
            <div className="space-y-6">
              {activities.length === 0 ? (
                <p className="text-xs text-[var(--text-dim)] font-bold italic text-center py-10 opacity-60">
                  Silence is golden. No recent activity yet.
                </p>
              ) : (
                activities.map((activity, idx) => (
                  <div key={idx} className="relative pl-6 pb-6 border-l border-[var(--border)] last:pb-0 group cursor-pointer" onClick={() => navigate(`/editor/${activity.documentId}`)}>
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-lg shadow-[var(--accent-soft)] group-hover:scale-150 transition-transform" />
                    <p className="text-[10px] text-[var(--accent)] font-extrabold uppercase mb-1 tracking-widest">{activity.documentTitle}</p>
                    <p className="text-xs font-bold text-[var(--text-main)] leading-snug line-clamp-2 mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {activity.text}
                    </p>
                    <p className="text-[10px] text-[var(--text-dim)]">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="glass rounded-3xl p-6 shadow-xl">
             <h3 className="text-sm font-extrabold mb-4">Elite Tip</h3>
             <p className="text-xs text-[var(--text-dim)] leading-relaxed font-bold">
               Use the <strong>Music & Focus</strong> mode in the editor to boost your deep-writing productivity.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({ doc, onDelete, isOwner, onClick }) => (
  <div 
    onClick={onClick}
    className="glass rounded-3xl p-6 shadow-xl hover:shadow-[var(--accent-soft)] hover:-translate-y-1 hover:border-[var(--accent)] transition-all duration-300 group relative cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-[var(--bg-main)] rounded-xl group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-300 border border-[var(--border)]">
        <FileText className="w-6 h-6 text-[var(--accent)] group-hover:text-white" />
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="p-1.5 text-[var(--text-dim)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        {isOwner && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-[var(--text-dim)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
    
    <h3 className="font-bold text-[var(--text-main)] mb-1 group-hover:text-[var(--accent)] transition-colors line-clamp-1">{doc.title}</h3>
    <p className="text-sm text-[var(--text-dim)] mb-4 h-10 line-clamp-2 leading-relaxed font-bold">
      {doc.content || 'No content yet...'}
    </p>
    
    <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">
      <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
      <span className={`px-2 py-0.5 rounded-lg border ${isOwner ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
        {isOwner ? 'Owner' : 'Collaborator'}
      </span>
    </div>
  </div>
);

export default Dashboard;
