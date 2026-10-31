import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ShieldAlert,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function Incidents() {
  const navigate = useNavigate();
  const { incidents, systems, components, addIncident, globalSearch } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    systemId: systems[0]?.id || '',
    componentId: components[0]?.id || '',
    title: '',
    description: '',
    symptoms: '',
    severity: 'High',
    environmentalConditions: '',
    notes: '',
  });

  const handleOpenAddModal = () => {
    setFormData({
      systemId: systems[0]?.id || '',
      componentId: components[0]?.id || '',
      title: '',
      description: '',
      symptoms: '',
      severity: 'High',
      environmentalConditions: 'Ambient lab test conditions (25°C, 1 atm)',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSystemChange = (e) => {
    const sysId = e.target.value;
    const compsInSys = components.filter((c) => c.systemId === sysId);
    setFormData({
      ...formData,
      systemId: sysId,
      componentId: compsInSys[0]?.id || components[0]?.id || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.componentId) return;

    addIncident({
      ...formData,
      assignedEngineer: 'Keshav Gattani',
    });

    setIsAddModalOpen(false);
  };

  // Filter incidents
  const activeSearch = searchTerm || globalSearch;
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      !activeSearch ||
      inc.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      inc.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      inc.componentName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      inc.symptoms?.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            Hardware Incident & Anomaly Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture electronic system failures, radiation anomalies, and trigger autonomous VAJRA memory generation
          </p>
        </div>
        <Button onClick={handleOpenAddModal} icon={Plus} variant="primary">
          Log New Incident
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search incidents by ID, title, symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Action Required">Action Required</option>
            <option value="Investigated">Investigated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      {filteredIncidents.length === 0 ? (
        <EmptyState
          title="No incidents found"
          description="Try clearing search filters or log a new hardware anomaly event."
          actionText="Log Incident"
          onAction={handleOpenAddModal}
          icon={AlertTriangle}
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Incident ID</th>
                  <th className="py-3 px-4 font-semibold">Component</th>
                  <th className="py-3 px-4 font-semibold">Issue Title & Symptoms</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Reported Date</th>
                  <th className="py-3 px-4 font-semibold">Investigation Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {inc.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {inc.componentName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{inc.componentId}</div>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-medium text-slate-200">{inc.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {inc.symptoms}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={inc.severity} size="sm">
                        {inc.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {inc.reportedDate?.split(' ')[0]}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={inc.status} size="sm">
                        {inc.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex p-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Incident Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Semiconductor Failure Incident"
        subtitle="Records telemetry anomalies and immediately triggers VAJRA Agentic Memory Extraction."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Electronic System</label>
              <select
                value={formData.systemId}
                onChange={handleSystemChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Affected Semiconductor Part</label>
              <select
                value={formData.componentId}
                onChange={(e) => setFormData({ ...formData, componentId: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                {components.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Incident Headline / Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. Single-Event Latchup on DSP tile 3 during thermal cycle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Critical">Critical (Immediate System Threat / Latchup)</option>
                <option value="High">High (Thermal / Voltage Exceedance)</option>
                <option value="Medium">Medium (Timing Jitter / Offset Drift)</option>
                <option value="Low">Low (Telemetry Glitch)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Environmental Conditions</label>
              <input
                type="text"
                placeholder="e.g. +85°C hotspot, 20G vibration, low earth orbit vacuum"
                value={formData.environmentalConditions}
                onChange={(e) => setFormData({ ...formData, environmentalConditions: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observed Telemetry Symptoms</label>
            <input
              type="text"
              required
              placeholder="e.g. Current surge from 8.2A to 19.4A, crowbar triggered, PLL loss of lock"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Comprehensive Physical & Circuit Description</label>
            <textarea
              rows={3}
              required
              placeholder="Detail voltage rail transitions, circuit behavior, scope captures..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Initial Engineering Notes / Presumptions</label>
            <input
              type="text"
              placeholder="e.g. Suspected negative gate ringing or parasitic PCB trace inductance"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Agentic Memory Automation:</strong> Submitting will automatically schedule VAJRA to extract a candidate Failure/Observation memory into the MongoDB persistent vector repository.
            </span>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Anomaly & Run Memory Extraction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
