import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--accent)] text-white hover:opacity-90 focus:ring-[var(--accent)] shadow-lg shadow-[var(--accent-soft)] active:scale-95',
    secondary: 'bg-[var(--bg-main)] text-[var(--text-main)] hover:bg-[var(--accent-soft)] focus:ring-[var(--border)] border border-[var(--border)]',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md',
    outline: 'border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] focus:ring-[var(--accent)]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
