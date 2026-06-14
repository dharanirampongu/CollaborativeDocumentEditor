import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Zap, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen text-[var(--text-main)]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-accent text-[var(--accent)] text-sm font-semibold mb-8 animate-pulse shadow-lg shadow-[var(--accent-soft)]">
            New: AI Writing Assistant now live! ✨
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Collaborative Editing <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-sky-600">
              Redefined for Teams
            </span>
          </h1>
          
          <p className="text-xl text-[var(--text-dim)] max-w-2xl mx-auto mb-10 leading-relaxed font-bold">
            The professional, lightning-fast editor designed for high-performance teams. Create, share, and edit together in real-time with zero overhead.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button className="w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center space-x-2 shadow-xl shadow-[var(--accent-soft)]">
                <span>Start Writing for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                View Demo
              </Button>
            </Link>
          </div>
          
          <div className="mt-20 relative px-4">
            <div className="max-w-5xl mx-auto glass rounded-2xl shadow-2xl border-[var(--border)] overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
              <img 
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200&h=600" 
                alt="App Screenshot" 
                className="w-full h-auto opacity-90 brightness-[0.9] dark:brightness-[0.7] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-[var(--accent-soft)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Everything you need to ship together</h2>
            <p className="mt-4 text-[var(--text-dim)] font-bold">Focus on the content, we'll handle the sync with elite tools.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-[var(--accent)]" />}
              title="Real-time Sync"
              description="Changes appear instantly across all devices. No more 'Save' buttons or version conflicts."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />}
              title="Team Centric"
              description="Add collaborators with a single click. Manage roles and permissions with ease."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-[var(--accent)]" />}
              title="Secure by Default"
              description="Your data is encrypted and backed up automatically. You own your content."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass p-8 rounded-3xl border border-[var(--border)] hover:bg-[var(--accent-soft)]/20 hover:border-[var(--accent)]/30 transition-all duration-300 group">
    <div className="w-12 h-12 bg-[var(--bg-main)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg lg:shadow-[var(--accent-soft)] transition-transform duration-200 border border-[var(--border)]">
      {icon}
    </div>
    <h3 className="text-xl font-extrabold text-[var(--text-main)] mb-3">{title}</h3>
    <p className="text-[var(--text-dim)] leading-relaxed font-bold">{description}</p>
  </div>
);

export default Home;
