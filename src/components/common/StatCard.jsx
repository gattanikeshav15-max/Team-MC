import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, trendLabel, color = 'cyan' }) {
  const colorGradients = {
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400',
    blue: 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/10 to-transparent border-rose-500/20 text-rose-400',
    purple: 'from-purple-500/10 to-transparent border-purple-500/20 text-purple-400',
  }[color] || 'from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${colorGradients} bg-slate-900/60 p-5 border backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgba(6,182,212,0.12)] group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
            {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
          </div>
        </div>
        {Icon && (
          <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/50 text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trendLabel && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className={`font-semibold ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendLabel}
          </span>
          <span className="text-slate-500">vs historical baseline</span>
        </div>
      )}
    </div>
  );
}
