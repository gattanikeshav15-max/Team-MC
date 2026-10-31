import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  AlertTriangle,
  BrainCircuit,
  Database,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Systems', path: '/systems', icon: Layers },
    { name: 'Components', path: '/components', icon: Cpu },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'VAJRA AI Assistant', path: '/vajra', icon: BrainCircuit, badge: 'AI' },
    { name: 'Memory Explorer', path: '/memories', icon: Database, badge: 'Agentic' },
    { name: 'Reliability Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Platform Brand Header */}
      <div className="flex h-18 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-wide text-white">SiliconSentinel</span>
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase">
                VAJRA Core v2.6
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors ${
            collapsed ? 'mx-auto mt-2' : ''
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Platform Navigation'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-md bg-cyan-950 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-800/60">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Memory Engine Indicator & User Profile */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/50">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                VAJRA Engine
              </span>
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-400 leading-tight">
              Agentic Memory Graph & Vector Store Synced
            </p>
          </div>
        )}

        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-xs font-bold text-white shadow-md">
              KG
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <h5 className="truncate text-xs font-bold text-white">Keshav Gattani</h5>
              <p className="truncate text-[10px] text-slate-400">Team MC • SVNIT Lead</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

