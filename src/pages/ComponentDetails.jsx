import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Cpu,
  ArrowLeft,
  AlertTriangle,
  BrainCircuit,
  Wrench,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function ComponentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { components, systems, incidents, memories, addIncident } = useAppData();

  const component = components.find((c) => c.id === id);

  // Modal for reporting incident directly from component page
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    title: '',
    description: '',
    symptoms: '',
    severity: 'High',
    environmentalConditions: '',
    notes: '',
  });

  if (!component) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-white">Component Not Found</h3>
        <p className="text-xs text-slate-400 mt-2 mb-4">No component matches identifier {id}</p>
        <Button onClick={() => navigate('/components')} variant="secondary">
          Return to Component Registry
        </Button>
      </div>
    );
  }

  const system = systems.find((s) => s.id === component.systemId);
  const componentIncidents = incidents.filter((i) => i.componentId === component.id);
  const componentMemories = memories.filter((m) => m.componentId === component.id);

  const handleReportIncident = (e) => {
    e.preventDefault();
    if (!incidentForm.title) return;

    addIncident({
      ...incidentForm,
      componentId: component.id,
      componentName: component.name,
      systemId: component.systemId,
      assignedEngineer: 'Keshav Gattani',
    });

    setIsReportModalOpen(false);
    setIncidentForm({
      title: '',
      description: '',
      symptoms: '',
      severity: 'High',
      environmentalConditions: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Action */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate('/components')}
          icon={ArrowLeft}
          variant="ghost"
          size="sm"
        >
          Back to Component Registry
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/vajra')}
            icon={BrainCircuit}
            variant="outline"
            size="sm"
          >
            Ask VAJRA About Component
          </Button>
          <Button
            onClick={() => setIsReportModalOpen(true)}
            icon={AlertTriangle}
            variant="primary"
            size="sm"
          >
            Report New Incident
          </Button>
        </div>
      </div>

      {/* Component Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-cyan-400">{component.id}</span>
              <Badge variant={component.status} size="md">
                {component.status}
              </Badge>
              <span className="font-mono text-xs text-slate-400">
                Part#: {component.partNumber}
              </span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {component.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-300 font-semibold">{component.manufacturer}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {component.category}
              </span>
              <span className="text-slate-500">•</span>
              <span
                onClick={() => system && navigate(`/systems/${system.id}`)}
                className="text-slate-300 hover:text-cyan-400 cursor-pointer flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                {system ? system.name : component.systemName}
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {component.description}
            </p>
          </div>

          {/* MTBF and Incident stats */}
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total MTBF
              </span>
              <div className="mt-1 text-2xl font-black text-white font-mono">
                {component.mtbfHours ? (component.mtbfHours / 1000).toFixed(0) : '450'}k hrs
              </div>
              <span className="text-[10px] text-emerald-400 block mt-1">Telcordia SR-332</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recorded Incidents
              </span>
              <div
                className={`mt-1 text-2xl font-black font-mono ${
                  component.incidentCount > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {component.incidentCount}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Lifecycle Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-cyan-400" />
          Semiconductor Technical Specifications & Physical Limits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {component.technicalSpecs &&
            Object.entries(component.technicalSpecs).map(([key, val]) => (
              <div
                key={key}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="mt-1 text-sm font-bold text-white font-mono">{val}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Grid: Incident History & Related VAJRA Engineering Memories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Incident & Anomaly History ({componentIncidents.length})
              </h3>
            </div>

            {componentIncidents.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Zero anomalies reported for this component.
              </p>
            ) : (
              <div className="space-y-3">
                {componentIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-semibold text-cyan-400">{inc.id}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={inc.severity} size="sm">
                          {inc.severity}
                        </Badge>
                        <Badge variant={inc.status} size="sm">
                          {inc.status}
                        </Badge>
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-white">{inc.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inc.description}</p>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Reported: {inc.reportedDate}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
              icon={AlertTriangle}
            >
              Log New Incident
            </Button>
          </div>
        </div>

        {/* Related VAJRA Agentic Memories */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                VAJRA Memories for this Part ({componentMemories.length})
              </h3>
              <p className="text-xs text-slate-400">Grounded semantic knowledge stored in MongoDB</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/memories')}
            >
              View in Explorer
            </Button>
          </div>

          {componentMemories.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No memories extracted yet for this component.
            </p>
          ) : (
            <div className="space-y-3">
              {componentMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
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
                  <p className="text-xs text-slate-300 leading-relaxed">{mem.content}</p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Source: {mem.source}</span>
                    <span className="text-cyan-400">Confidence: {mem.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-cyan-400" />
          Maintenance Actions & Physical Inspect History
        </h3>
        {component.maintenanceHistory && component.maintenanceHistory.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {component.maintenanceHistory.map((m, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{m.action}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">Technician: {m.technician}</div>
                </div>
                <span className="font-mono text-slate-500">{m.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No scheduled depot maintenance recorded.</p>
        )}
      </div>

      {/* Modal to Report Incident from Component Page */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={`Report Anomaly for ${component.name}`}
        subtitle={`System: ${system ? system.name : component.systemId}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleReportIncident} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Incident Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Transient overshoot during pulsed voltage ramp"
              value={incidentForm.title}
              onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
              <select
                value={incidentForm.severity}
                onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Environmental Profile</label>
              <input
                type="text"
                placeholder="e.g. -40°C Cryo Chamber, 10-6 Torr"
                value={incidentForm.environmentalConditions}
                onChange={(e) => setIncidentForm({ ...incidentForm, environmentalConditions: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Detailed Anomaly Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe what occurred during electronic testing or flight operations..."
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observed Symptoms & Telemetry Flags</label>
            <input
              type="text"
              placeholder="e.g. Vds spike +42V, current jump to 19.4A, PLL unlock"
              value={incidentForm.symptoms}
              onChange={(e) => setIncidentForm({ ...incidentForm, symptoms: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Anomaly & Extract Memory
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
