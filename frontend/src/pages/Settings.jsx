import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Moon, Sun, Monitor, Bell, Shield, User } from 'lucide-react';
import Button from '../components/Button';

const Settings = () => {
  const { theme, toggleTheme, palette, setPalette } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [profile, setProfile] = useState({
    username: user?.username || 'Dharani',
    email: user?.email || 'dharani@example.com'
  });
  const [notifications, setNotifications] = useState({
    activity: true,
    polls: true,
    ai: true
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">Settings</h1>
        <p className="text-[var(--text-dim)]">Manage your preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          <SettingsTab 
            icon={<Monitor className="w-4 h-4" />} 
            label="Appearance" 
            active={activeTab === 'appearance'} 
            onClick={() => setActiveTab('appearance')}
          />
          <SettingsTab 
            icon={<User className="w-4 h-4" />} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsTab 
            icon={<Bell className="w-4 h-4" />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 shadow-xl min-h-[400px]">
            {activeTab === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-lg font-bold mb-6 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-[var(--accent)]" />
                  Appearance
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Theme Mode</h3>
                      <p className="text-xs text-[var(--text-dim)] mt-1">Switch between light and dark themes.</p>
                    </div>
                    <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border)]">
                      <button 
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </button>
                      <button 
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-[var(--accent)] text-white shadow-lg' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border)]">
                    <h3 className="text-sm font-bold mb-4">Color Palette</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPalette('sky')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${palette === 'sky' ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${palette === 'sky' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>Sky Blue</span>
                          <div className="w-4 h-4 rounded-full bg-[#0ea5e9]" />
                        </div>
                        <div className="space-y-1.5 opacity-50">
                          <div className="h-1.5 w-full bg-[var(--border)] rounded-full" />
                          <div className="h-1.5 w-3/4 bg-[var(--border)] rounded-full" />
                        </div>
                      </div>
                      <div 
                        onClick={() => setPalette('sunset')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${palette === 'sunset' ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--accent)]/30'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${palette === 'sunset' ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>Sunset Gold</span>
                          <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
                        </div>
                        <div className="space-y-1.5 opacity-50">
                          <div className="h-1.5 w-full bg-[var(--border)] rounded-full" />
                          <div className="h-1.5 w-3/4 bg-[var(--border)] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-lg font-bold mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[var(--accent)]" />
                  Profile Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1 tracking-widest">Username</label>
                    <input 
                      type="text" 
                      value={profile.username}
                      onChange={e => setProfile({...profile, username: e.target.value})}
                      className="w-full p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/50 text-sm focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-dim)] mb-1 tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/50 text-sm focus:ring-2 focus:ring-[var(--accent)]/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="p-4 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent)]/10 flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold">Public Identity</p>
                        <p className="text-xs text-[var(--text-dim)]">This is how your cursor and polls will appear to others.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h2 className="text-lg font-bold mb-6 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-[var(--accent)]" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <NotificationToggle 
                    label="Contextual Activity Alerts" 
                    desc="Get summarized updates on document changes."
                    enabled={notifications.activity}
                    onChange={() => setNotifications({...notifications, activity: !notifications.activity})}
                  />
                  <NotificationToggle 
                    label="Poll & Decision Updates" 
                    desc="Notifications when new polls are created or resolved."
                    enabled={notifications.polls}
                    onChange={() => setNotifications({...notifications, polls: !notifications.polls})}
                  />
                  <NotificationToggle 
                    label="AI Insight Toast" 
                    desc="Real-time tips and grammar suggestions as you type."
                    enabled={notifications.ai}
                    onChange={() => setNotifications({...notifications, ai: !notifications.ai})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary">Reset Defaults</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]' : 'text-[var(--text-dim)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const NotificationToggle = ({ label, desc, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/30">
    <div>
      <p className="text-sm font-bold">{label}</p>
      <p className="text-[10px] text-[var(--text-dim)]">{desc}</p>
    </div>
    <button 
      onClick={onChange}
      className={`w-10 h-6 rounded-full transition-all relative ${enabled ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-5' : 'left-1'}`} />
    </button>
  </div>
);

export default Settings;
