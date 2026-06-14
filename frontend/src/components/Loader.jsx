import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const loader = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Brilliance...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
