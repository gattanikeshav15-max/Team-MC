import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  FilePlus,
  BrainCircuit,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // 5 Clean Sections as required for Hackathon MVP
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Add Research', path: '/add-research', icon: FilePlus, badge: 'Upload' },
    { name: 'VAJRA Assistant', path: '/vajra', icon: BrainCircuit, badge: 'AI' },
    { name: 'Knowledge Transfer', path: '/transfer', icon: Share2, badge: 'Handoff' },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold tracking-wide text-white">SiliconSentinel</span>
              <p className="text-[10px] font-semibold text-cyan-400">VAJRA Memory Engine</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white transition-colors ${
            collapsed ? 'mx-auto mt-2' : ''
          }`}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
        <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Main Menu'}
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
                    ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-md bg-cyan-950 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-800">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User / Team Section */}
      <div className="border-t border-slate-800 p-3 bg-slate-950">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-xs font-bold text-white">
              KG
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <h5 className="truncate text-xs font-bold text-white">Keshav Gattani</h5>
              <p className="truncate text-[10px] text-slate-400">Team MC • Hackathon</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
