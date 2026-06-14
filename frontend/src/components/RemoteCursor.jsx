import React from 'react';

const RemoteCursor = ({ username, color, position, selectionText }) => {
  if (!position) return null;

  return (
    <div 
      className="absolute pointer-events-none transition-all duration-100 ease-out z-40"
      style={{ 
        top: position.top, 
        left: position.left,
      }}
    >
      {/* Cursor Bar */}
      <div 
        className="w-0.5 h-6 animate-pulse"
        style={{ backgroundColor: color }}
      />
      
      {/* Name Tag */}
      <div 
        className="absolute bottom-full left-0 px-1.5 py-0.5 rounded-tr-md rounded-tl-md rounded-br-md text-[8px] font-extrabold text-white whitespace-nowrap shadow-sm transform -translate-y-0.5"
        style={{ backgroundColor: color }}
      >
        {username}
      </div>

      {/* Selection Tooltip (Optional) */}
      {selectionText && (
        <div className="absolute top-7 left-0 glass p-2 rounded-lg border border-[var(--border)] text-[9px] max-w-[120px] line-clamp-2 italic opacity-60">
          Selecting: "{selectionText}"
        </div>
      )}
    </div>
  );
};

export default RemoteCursor;
