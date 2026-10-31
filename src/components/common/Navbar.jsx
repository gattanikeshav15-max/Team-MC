import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Activity, ShieldCheck, Database, Check } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { globalSearch, setGlobalSearch, stats } = useAppData();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Overview Dashboard', subtitle: 'Real-time reliability & engineering memory overview' };
    if (path.startsWith('/systems/')) return { title: 'System Architecture Profile', subtitle: 'Hardware subsystem specs & component allocation' };
    if (path === '/systems') return { title: 'Systems Management', subtitle: 'Electronic systems & payload infrastructure' };
    if (path.startsWith('/components/')) return { title: 'Component Intelligence Profile', subtitle: 'Semiconductor physics, incidents & memory trace' };
    if (path === '/components') return { title: 'Component Registry', subtitle: 'Semiconductor parts, microcontrollers, FPGAs & power ICs' };
    if (path.startsWith('/incidents/')) return { title: 'Incident Investigation', subtitle: 'Root-cause timeline, evidence & corrective actions' };
    if (path === '/incidents') return { title: 'Incident Management', subtitle: 'Electronic system failures, anomalies & telemetry alarms' };
    if (path === '/vajra') return { title: 'VAJRA AI Assistant', subtitle: 'Autonomous retrieval-augmented engineering memory' };
    if (path === '/memories') return { title: 'Memory Explorer', subtitle: 'Persistent agentic engineering memories & decision logs' };
    if (path === '/analytics') return { title: 'Reliability Analytics', subtitle: 'Semiconductor failure rates, MTBF & memory metrics' };
    if (path === '/settings') return { title: 'Platform Settings', subtitle: 'API gateways, security policies & user preferences' };
    return { title: 'SiliconSentinel', subtitle: 'Engineering Memory & Reliability Intelligence' };
  };

  const pageInfo = getPageInfo();

  const notifications = [
    { id: 1, title: 'Gate Leakage Surge', time: '10m ago', unread: true, detail: 'CMP-GAN-4401 in SYS-SAT-02 exceeded Igss threshold.' },
    { id: 2, title: 'VAJRA Memory Extracted', time: '45m ago', unread: true, detail: 'Automated memory MEM-2026-901 extracted from INC-2026-089.' },
    { id: 3, title: 'SEU Scrub Cycle Synchronized', time: '2h ago', unread: false, detail: 'Scrub interval tuned to 50ms on XQRKU060.' },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-cyan-400 font-medium">SiliconSentinel</span>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{pageInfo.title}</span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-wide">{pageInfo.title}</h1>
      </div>

      {/* Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search systems, components (e.g. EPC2050), memories, or incidents..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Telemetry Status, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-[11px]">Atlas Memory Synced</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Telemetry Alerts</span>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                  2 Unread
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      item.unread
                        ? 'border-cyan-500/30 bg-cyan-950/20 text-slate-200'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-white">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          title="Open Settings"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-md group-hover:ring-2 ring-cyan-400 transition-all">
            KG
          </div>
        </div>
      </div>
    </header>
  );
}

