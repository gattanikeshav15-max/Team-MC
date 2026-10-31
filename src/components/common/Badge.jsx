import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  }[size] || 'text-xs px-2.5 py-1';

  const variantClasses = {
    // Statuses
    Nominal: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
    Degraded: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    Warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    Critical: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]',
    'Under Maintenance': 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.15)]',
    
    // Severities
    High: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    
    // Investigation statuses
    'Under Investigation': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    'Action Required': 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    Resolved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    Investigated: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',

    // Verification Statuses
    Verified: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    Unverified: 'bg-amber-500/15 text-amber-300 border border-amber-500/40 border-dashed shadow-[0_0_8px_rgba(245,158,11,0.15)]',
    Corrected: 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    Archived: 'bg-slate-700/30 text-slate-400 border border-slate-600/40',

    // Memory Types
    'Failure Memory': 'bg-red-500/10 text-red-400 border border-red-500/30',
    'Observation Memory': 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    'Maintenance Memory': 'bg-teal-500/10 text-teal-400 border border-teal-500/30',
    'Environmental Memory': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    'Decision Memory': 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
    'Outcome Memory': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',

    default: 'bg-slate-800 text-slate-300 border border-slate-700',
  }[variant] || 'bg-slate-800 text-slate-300 border border-slate-700';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${variantClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
}
