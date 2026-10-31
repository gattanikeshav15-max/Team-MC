import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Database, Shield, Zap } from 'lucide-react';

export default function Navbar() {
  const { backendStatus } = useAppData();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Cross-Project Engineering Memory
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection Status Pill */}
        <div className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[11px]">
          <span
            className={`h-2 w-2 rounded-full ${
              backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-slate-300 font-medium">{backendStatus.label}</span>
        </div>

        {/* VAJRA Status */}
        <div className="hidden sm:flex items-center gap-1 rounded-md bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 text-[10px] text-cyan-400 font-semibold">
          <Zap className="w-3 h-3 text-cyan-400" />
          VAJRA Engine
        </div>
      </div>
    </header>
  );
}
