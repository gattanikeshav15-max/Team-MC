import React from 'react';
import {
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  Wrench,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { useAppData } from '../context/AppDataContext';
import StatCard from '../components/common/StatCard';

export default function Analytics() {
  const { systems, components, incidents, memories, stats } = useAppData();

  // 1. Reliability Trend Data
  const reliabilityTrend = [
    { month: 'May 26', amc: 99.8, parc: 94.2, pcdu: 98.1, avlin: 91.0 },
    { month: 'Jun 26', amc: 99.4, parc: 93.1, pcdu: 97.8, avlin: 89.2 },
    { month: 'Jul 26', amc: 99.0, parc: 91.5, pcdu: 97.2, avlin: 87.5 },
    { month: 'Aug 26', amc: 98.5, parc: 90.0, pcdu: 96.9, avlin: 86.0 },
    { month: 'Sep 26', amc: 98.2, parc: 89.8, pcdu: 96.8, avlin: 84.8 },
    { month: 'Oct 26', amc: 98.4, parc: 89.2, pcdu: 96.7, avlin: 84.1 },
  ];

  // 2. Incidents by Severity
  const severityCount = {
    Critical: incidents.filter((i) => i.severity === 'Critical').length,
    High: incidents.filter((i) => i.severity === 'High').length,
    Medium: incidents.filter((i) => i.severity === 'Medium').length,
    Low: incidents.filter((i) => i.severity === 'Low').length,
  };
  const severityData = [
    { name: 'Critical', count: severityCount.Critical, fill: '#F43F5E' },
    { name: 'High', count: severityCount.High, fill: '#FB923C' },
    { name: 'Medium', count: severityCount.Medium, fill: '#FBBF24' },
    { name: 'Low', count: severityCount.Low, fill: '#38BDF8' },
  ];

  // 3. Memory Distribution by Category
  const memoryCategoryCounts = {};
  memories.forEach((m) => {
    memoryCategoryCounts[m.type] = (memoryCategoryCounts[m.type] || 0) + 1;
  });
  const memoryCategoryData = Object.entries(memoryCategoryCounts).map(([cat, cnt]) => ({
    name: cat.replace(' Memory', ''),
    value: cnt,
  }));
  const MEMORY_COLORS = ['#EF4444', '#3B82F6', '#14B8A6', '#10B981', '#6366F1', '#06B6D4'];

  // 4. Verified vs Unverified vs Corrected vs Archived Memories
  const verificationData = [
    {
      name: 'Status Breakdown',
      Verified: memories.filter((m) => m.verificationStatus === 'Verified').length,
      Unverified: memories.filter((m) => m.verificationStatus === 'Unverified').length,
      Corrected: memories.filter((m) => m.verificationStatus === 'Corrected').length,
      Archived: memories.filter((m) => m.verificationStatus === 'Archived').length,
    },
  ];

  // 5. Frequently Affected Components
  const affectedComponentsData = components
    .map((c) => ({
      name: c.id.replace('CMP-', ''),
      fullName: c.name,
      incidents: c.incidentCount,
    }))
    .sort((a, b) => b.incidents - a.incidents);

  // 6. Monthly Maintenance Activities
  const maintenanceData = [
    { month: 'Jun', inspections: 8, replacements: 2, recalibrations: 5 },
    { month: 'Jul', inspections: 12, replacements: 3, recalibrations: 7 },
    { month: 'Aug', inspections: 15, replacements: 4, recalibrations: 6 },
    { month: 'Sep', inspections: 10, replacements: 1, recalibrations: 4 },
    { month: 'Oct', inspections: 14, replacements: 2, recalibrations: 9 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-cyan-400" />
          Reliability & Agentic Memory Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          High-dimensional telemetry synthesis, semiconductor MTBF curves, and knowledge graph verification rates
        </p>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fleet MTBF Benchmark"
          value="642k hrs"
          subtitle="Telcordia Calc"
          icon={Activity}
          color="cyan"
          trend="up"
          trendLabel="+4.2% Stability"
        />
        <StatCard
          title="Critical Anomaly Rate"
          value="0.38 / yr"
          subtitle="Per platform"
          icon={AlertTriangle}
          color="amber"
          trend="down"
          trendLabel="-18% Year-over-Year"
        />
        <StatCard
          title="Memory Grounding Ratio"
          value={`${((stats.verifiedMemoriesCount / (memories.length || 1)) * 100).toFixed(0)}%`}
          subtitle="Verified facts"
          icon={Database}
          color="emerald"
          trend="up"
          trendLabel="Strict Peer Reviewed"
        />
        <StatCard
          title="Mean Repair Latency"
          value="4.6 hrs"
          subtitle="Depot turnaround"
          icon={Wrench}
          color="blue"
          trend="down"
          trendLabel="-1.2 hrs with VAJRA"
        />
      </div>

      {/* Row 1: Fleet Reliability Trend & Incidents by Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Reliability Trend (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Subsystem Reliability Envelope Over Time
              </h3>
              <p className="text-xs text-slate-400">Monthly degradation curve across primary platforms</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reliabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke="#64748B" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#06B6D4',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="amc"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Avionics Computer (AMC-V)"
                />
                <Line
                  type="monotone"
                  dataKey="pcdu"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  name="Satellite PCDU-Alpha"
                />
                <Line
                  type="monotone"
                  dataKey="parc"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Phased Radar (PARC-9)"
                />
                <Line
                  type="monotone"
                  dataKey="avlin"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  name="LiDAR Hub (AV-LIN-3)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Severity (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Incidents by Severity
            </h3>
            <p className="text-xs text-slate-400 mb-4">Total active & investigated anomalies</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#38BDF8',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="count" name="Incidents" radius={[6, 6, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Critical Latchup Events: 1</span>
            <span className="text-rose-400 font-bold">100% Mitigated</span>
          </div>
        </div>
      </div>

      {/* Row 2: Memory Distribution & Verified vs Unverified Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Distribution by Category */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            VAJRA Memory Categories Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Semantic memory store taxonomy</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memoryCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {memoryCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MEMORY_COLORS[index % MEMORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#06B6D4',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verified vs Unverified Memories */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Engineering Verification & Audit Rigor
          </h3>
          <p className="text-xs text-slate-400 mb-4">Distribution of grounded facts vs hypotheses</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#64748B" tick={{ fontSize: 11 }} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#10B981',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Verified" fill="#10B981" radius={[0, 4, 4, 0]} name="Verified Facts" />
                <Bar dataKey="Unverified" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Unverified Hypotheses" />
                <Bar dataKey="Corrected" fill="#A855F7" radius={[0, 4, 4, 0]} name="Corrected Records" />
                <Bar dataKey="Archived" fill="#64748B" radius={[0, 4, 4, 0]} name="Archived Legacy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Most Affected Components & Monthly Maintenance Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Frequently Affected Components */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-amber-400" />
            Most Frequently Affected Semiconductors
          </h3>
          <p className="text-xs text-slate-400 mb-4">Lifetime recorded telemetry anomalies per part</p>

          <div className="space-y-3">
            {affectedComponentsData.map((item, idx) => (
              <div
                key={item.name}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500">#{idx + 1}</span>
                  <div>
                    <span className="font-bold text-xs text-white">{item.fullName}</span>
                    <span className="font-mono text-[10px] text-cyan-400 block">CMP-{item.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.incidents > 2 ? 'bg-rose-500' : item.incidents > 0 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(item.incidents * 25, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {item.incidents} Incidents
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Maintenance Activity */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Depot Maintenance & Calibration Activity
          </h3>
          <p className="text-xs text-slate-400 mb-4">Hardware repairs guided by VAJRA memory heuristics</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#06B6D4',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="inspections" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Inspections" />
                <Bar dataKey="recalibrations" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Recalibrations" />
                <Bar dataKey="replacements" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Part Replacements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
