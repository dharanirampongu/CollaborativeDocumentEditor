import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, UserMinus, Mail, Shield, User } from 'lucide-react';
import api from '../services/api';
import Button from './Button';

const ShareModal = ({ isOpen, onClose, documentId, ownerId, collaborators, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collaboratorSearchQuery, setCollaboratorSearchQuery] = useState('');

  const filteredCollaborators = collaborators.filter(user => 
    user.username.toLowerCase().includes(collaboratorSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(collaboratorSearchQuery.toLowerCase())
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/search?q=${searchQuery}`);
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const addCollaborator = async (userId) => {
    try {
      const { data } = await api.post(`/docs/${documentId}/collaborators`, { userId });
      onUpdate(data); // data is the updated collaborators list
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
      setTimeout(() => setError(''), 3000);
    }
  };

  const removeCollaborator = async (userId) => {
    try {
      const { data } = await api.delete(`/docs/${documentId}/collaborators/${userId}`);
      onUpdate(data);
    } catch (err) {
      setError('Failed to remove collaborator');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="bg-[var(--accent)] p-1.5 rounded-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Share Document</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Search Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Invite Collaborators</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all outline-none"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white border border-gray-150 rounded-xl shadow-2xl mt-1 absolute z-50 w-full left-0 max-h-60 overflow-y-auto animate-in slide-in-from-top-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                      onClick={() => addCollaborator(user._id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[var(--accent-soft)] rounded-full flex items-center justify-center text-[var(--accent)] font-bold text-xs uppercase">
                          {user.username.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <UserPlus className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100 animate-in shake duration-300">
              {error}
            </div>
          )}

          {/* Collaborators List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Who has access</h3>
              {collaborators.length > 0 && (
                <span className="text-xs text-[var(--text-dim)] font-bold">
                  {collaborators.length} {collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                </span>
              )}
            </div>

            {collaborators.length > 2 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all text-[var(--text-main)] placeholder-gray-400"
                  placeholder="Search current collaborators..."
                  value={collaboratorSearchQuery}
                  onChange={(e) => setCollaboratorSearchQuery(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    <Shield className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">Owner</p>
                    <p className="text-xs text-gray-500">Full control</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-1 rounded">Primary</span>
              </div>

              {collaborators.length > 0 && filteredCollaborators.length === 0 && (
                <p className="text-xs text-[var(--text-dim)] text-center py-4 italic">No matching collaborators found.</p>
              )}

              {/* Collaborators */}
              {filteredCollaborators.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm uppercase group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)] transition-colors">
                      {user.username.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{user.username}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeCollaborator(user._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {collaborators.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                  <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No collaborators yet.</p>
                  <p className="text-xs text-gray-400">Invite someone by searching above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="px-6">Done</Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
