import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  }[size] || 'px-4 py-2 text-sm rounded-xl gap-2';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/30',
    secondary:
      'bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-slate-700/80 hover:text-white',
    outline:
      'border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
    danger:
      'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 hover:text-rose-200',
    ghost:
      'text-slate-400 hover:text-white hover:bg-slate-800/60',
    success:
      'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 hover:text-emerald-200',
  }[variant] || 'bg-slate-800 text-slate-200';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
