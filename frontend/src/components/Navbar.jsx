import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon, Sun } from 'lucide-react';
import Button from './Button';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass border-b border-slate-800/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="CollabEdit Logo" className="w-8 h-8 rounded-lg group-hover:scale-105 transition-transform object-contain" />
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-sky-600">
              CollabEdit
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] font-bold transition-colors text-xs uppercase tracking-widest"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/settings" 
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] font-bold transition-colors text-xs uppercase tracking-widest"
                >
                  Settings
                </Link>
                <div className="flex items-center space-x-3 pl-6 border-l border-[var(--border)]">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] border border-[var(--glass-border)] flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <span className="text-sm font-bold text-[var(--text-main)]">
                      {user.username}
                    </span>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handleLogout}
                    className="!py-1.5 !px-3 text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] font-bold transition-colors text-xs uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link to="/settings" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
                  <Sun className="w-4 h-4" />
                </Link>
                <Link to="/register">
                  <Button className="shadow-lg shadow-[var(--accent-soft)]">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
