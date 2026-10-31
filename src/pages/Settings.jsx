import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Sliders,
  Key,
  Database,
  RotateCcw,
  CheckCircle2,
  Lock,
  Radio,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

export default function Settings() {
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: 'Keshav Gattani',
    title: 'Lead Reliability & Avionics Engineer',
    team: 'Team MC — SVNIT Nexus',
    email: 'keshav.gattani@svnit.ac.in',
    location: 'Surat, Gujarat, India',
  });

  const [notifications, setNotifications] = useState({
    criticalIncidents: true,
    memoryExtractions: true,
    telemetryThresholds: true,
    weeklyReport: false,
  });

  const [appConfig, setAppConfig] = useState({
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    dataRefreshInterval: '30s',
    vectorCosineThreshold: '0.78',
    ttlIndexDays: '90',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Engineering profile updated successfully.', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all systems, components, incidents, and memories back to default hackathon dataset?')) {
      localStorage.removeItem('silicon_sentinel_systems');
      localStorage.removeItem('silicon_sentinel_components');
      localStorage.removeItem('silicon_sentinel_incidents');
      localStorage.removeItem('silicon_sentinel_memories');
      localStorage.removeItem('silicon_sentinel_conversations');
      showToast('Local database restored to baseline. Reloading...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          SiliconSentinel Platform Configuration
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage engineer credentials, MongoDB Atlas integration, notification policies, and memory retention
        </p>
      </div>

      {/* Engineer Profile Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-cyan-400" />
          Engineering Personnel Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-xl shadow-cyan-950/40">
              KG
            </div>
            <div>
              <h4 className="text-base font-bold text-white">{profile.name}</h4>
              <p className="text-slate-400 font-mono text-[11px]">{profile.team}</p>
              <span className="inline-block mt-1 text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                Authorised Verifier: Level 3 Clearance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role / Job Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department / Base</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Profile Updates
            </Button>
          </div>
        </form>
      </div>

      {/* Backend & MongoDB Connection Architecture */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Backend API & MongoDB Atlas Vector Architecture
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Configure centralized Express.js endpoint & Vector Search parameters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Backend Base URL (VITE_API_BASE_URL)
            </label>
            <input
              type="text"
              value={appConfig.apiBaseUrl}
              onChange={(e) => setAppConfig({ ...appConfig, apiBaseUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Default: http://localhost:5000 (Centralized Axios Gateway)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Vector Search Cosine Similarity Threshold
            </label>
            <input
              type="text"
              value={appConfig.vectorCosineThreshold}
              onChange={(e) => setAppConfig({ ...appConfig, vectorCosineThreshold: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Minimum semantic match score required for VAJRA retrieval
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              MongoDB TTL Index Expiry (Days)
            </label>
            <input
              type="number"
              value={appConfig.ttlIndexDays}
              onChange={(e) => setAppConfig({ ...appConfig, ttlIndexDays: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Automated cleanup for transient observation memories
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Operational Status
            </label>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Atlas Cluster Connected • Zero Latency Drift
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-cyan-400" />
          Reliability Alarm & Memory Notifications
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Critical Hardware Incidents</span>
              <span className="text-slate-400">Immediate push alert on Single-Event Latchup or gate runaway</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.criticalIncidents}
              onChange={(e) => setNotifications({ ...notifications, criticalIncidents: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Autonomous VAJRA Memory Extractions</span>
              <span className="text-slate-400">Notify when VAJRA indexes a new candidate memory from an anomaly</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.memoryExtractions}
              onChange={(e) => setNotifications({ ...notifications, memoryExtractions: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
            <div>
              <span className="font-semibold text-white block">Telemetry Threshold Exceedances</span>
              <span className="text-slate-400">Alerts when semiconductor junction temperatures cross +105°C</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.telemetryThresholds}
              onChange={(e) => setNotifications({ ...notifications, telemetryThresholds: e.target.checked })}
              className="h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* Database Maintenance & Reset Action */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            Reset Local Hackathon Dataset
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Restores all systems, semiconductor components, incidents, and VAJRA memories to the initial SVNIT demonstration baseline.
          </p>
        </div>
        <Button onClick={handleResetData} variant="danger" size="sm">
          Reset Dataset
        </Button>
      </div>
    </div>
  );
}
