import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Cpu,
  AlertTriangle,
  Database,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertOctagon,
  BrainCircuit,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { systems, components, incidents, memories, stats, globalSearch } = useAppData();

  // Reliability timeline data for Recharts
  const reliabilityTrendData = [
    { date: 'May 26', reliability: 99.4, incidents: 1, memoriesExtracted: 4 },
    { date: 'Jun 26', reliability: 98.8, incidents: 2, memoriesExtracted: 8 },
    { date: 'Jul 26', reliability: 97.9, incidents: 3, memoriesExtracted: 11 },
    { date: 'Aug 26', reliability: 96.5, incidents: 4, memoriesExtracted: 15 },
    { date: 'Sep 26', reliability: 97.2, incidents: 2, memoriesExtracted: 19 },
    { date: 'Oct 26', reliability: 98.6, incidents: 1, memoriesExtracted: 24 },
  ];

  // Filter items if global search is present
  const recentIncidents = incidents
    .filter((i) =>
      !globalSearch ||
      i.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      i.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      i.componentName.toLowerCase().includes(globalSearch.toLowerCase())
    )
    .slice(0, 5);

  const recentMemories = memories
    .filter((m) =>
      !globalSearch ||
      m.content.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
      m.componentId.toLowerCase().includes(globalSearch.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner / Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              Autonomous Reliability Intelligence & Memory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              SiliconSentinel Intelligence Console
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Real-time semiconductor lifecycle tracking powered by <span className="text-cyan-400 font-semibold">VAJRA</span>.
              Transforming raw telemetry spikes, radiation latchups, and failure observations into persistent, auditable engineering knowledge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/vajra')}
              icon={BrainCircuit}
              variant="primary"
            >
              Consult VAJRA AI
            </Button>
            <Button
              onClick={() => navigate('/incidents')}
              icon={AlertTriangle}
              variant="secondary"
            >
              Log Incident
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Systems"
          value={stats.totalSystems}
          subtitle="Monitored"
          icon={Layers}
          color="cyan"
          trend="up"
          trendLabel="+1 System"
        />
        <StatCard
          title="Registered Parts"
          value={stats.registeredComponents}
          subtitle="Semiconductors"
          icon={Cpu}
          color="blue"
          trend="up"
          trendLabel="100% Tracked"
        />
        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents}
          subtitle="Lifecycle events"
          icon={AlertTriangle}
          color="amber"
          trend="down"
          trendLabel="-15% Failures"
        />
        <StatCard
          title="Verified Memories"
          value={stats.verifiedMemoriesCount}
          subtitle="Confirmed facts"
          icon={Database}
          color="emerald"
          trend="up"
          trendLabel="+4 This Month"
        />
        <StatCard
          title="Open Anomalies"
          value={stats.pendingInvestigations}
          subtitle="Action needed"
          icon={Clock}
          color={stats.pendingInvestigations > 0 ? 'rose' : 'emerald'}
          trend="down"
          trendLabel="Active Review"
        />
      </div>

      {/* Main Grid: Chart & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. System Reliability Overview Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Fleet Reliability & Memory Indexing Index
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite semiconductor MTBF trend vs automated memory extraction rate
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Reliability (%)
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Memories Extracted
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reliabilityTrendData}>
                <defs>
                  <linearGradient id="relGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[94, 100]} stroke="#64748B" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#06B6D4',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reliability"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#relGradient)"
                  name="Reliability Score"
                />
                <Line
                  type="monotone"
                  dataKey="memoriesExtracted"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Memories Extracted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. System Health (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Active Systems Telemetry
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/systems')}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {systems.slice(0, 4).map((sys) => (
                <div
                  key={sys.id}
                  onClick={() => navigate(`/systems/${sys.id}`)}
                  className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white truncate max-w-[180px]">
                      {sys.name}
                    </span>
                    <Badge variant={sys.status} size="sm">
                      {sys.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{sys.id}</span>
                    <span className="text-cyan-400">{sys.componentCount} Components</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <span className="text-xs text-slate-400">
              Atlas Shard Node: <span className="font-mono text-emerald-400">AP-SOUTH-1-M10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Recent Incidents & Recent Engineering Memories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. Recent Incidents Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                Recent Hardware Incidents
              </h3>
              <p className="text-xs text-slate-400">Failure telemetry requiring engineering diagnosis</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/incidents')}
            >
              Incident Hub
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3">Issue</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-cyan-400 whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">
                      {inc.componentName.split(' ')[0]}...
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">
                      {inc.title}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge variant={inc.severity} size="sm">
                        {inc.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <Badge variant={inc.status} size="sm">
                        {inc.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* C. Recent Engineering Memories (VAJRA) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Recent VAJRA Memories
              </h3>
              <p className="text-xs text-slate-400">Autonomous memory extractions and verified heuristics</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/memories')}
            >
              Explore Memories
            </Button>
          </div>

          <div className="space-y-3">
            {recentMemories.map((mem) => (
              <div
                key={mem.id}
                onClick={() => navigate('/memories')}
                className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-cyan-500/30 hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400">{mem.id}</span>
                    <Badge variant={mem.type} size="sm">
                      {mem.type}
                    </Badge>
                  </div>
                  <Badge variant={mem.verificationStatus} size="sm">
                    {mem.verificationStatus}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {mem.content}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Part: {mem.componentId}</span>
                  <span className="text-cyan-400/80">Confidence: {mem.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* E. VAJRA Activity Timeline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            VAJRA AI Memory Activity Log
          </h3>
          <span className="text-xs font-mono text-cyan-400">Continuous Vector Embeddings Engine</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
            <div className="text-[11px] font-bold text-cyan-400 font-mono uppercase">Memory Ingestion</div>
            <p className="mt-1 text-xs text-slate-300">
              Ingested incident telemetry and extracted 9 semantic vector embeddings for GaN power stage failure modes.
            </p>
            <span className="mt-2 block text-[10px] text-slate-500 font-mono">14 minutes ago</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
            <div className="text-[11px] font-bold text-emerald-400 font-mono uppercase">Verification Audit</div>
            <p className="mt-1 text-xs text-slate-300">
              Senior engineer verified C0G/NP0 capacitor dielectric replacement heuristic MEM-2026-872.
            </p>
            <span className="mt-2 block text-[10px] text-slate-500 font-mono">1 hour ago</span>
          </div>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
            <div className="text-[11px] font-bold text-purple-400 font-mono uppercase">Correction Logged</div>
            <p className="mt-1 text-xs text-slate-300">
              Hypothesis MEM-2026-815 corrected: Op-Amp offset drift attributed to surface hygroscopic moisture absorption.
            </p>
            <span className="mt-2 block text-[10px] text-slate-500 font-mono">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

