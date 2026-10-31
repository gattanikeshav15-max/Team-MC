import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Cpu,
  BrainCircuit,
  ShieldAlert,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incidents, components, memories, extractMemoryFromIncident } = useAppData();

  const incident = incidents.find((i) => i.id === id);

  if (!incident) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-white">Incident Record Not Found</h3>
        <p className="text-xs text-slate-400 mt-2 mb-4">No incident matches identifier {id}</p>
        <Button onClick={() => navigate('/incidents')} variant="secondary">
          Return to Incidents
        </Button>
      </div>
    );
  }

  const component = components.find((c) => c.id === incident.componentId);

  // Associated memories referencing this incident
  const associatedMemories = memories.filter(
    (m) =>
      m.source?.includes(incident.id) ||
      m.content?.includes(incident.id) ||
      m.componentId === incident.componentId
  );

  // Similar historical incidents (same component or similar severity)
  const similarIncidents = incidents.filter(
    (i) => i.id !== incident.id && (i.componentId === incident.componentId || i.severity === incident.severity)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate('/incidents')}
          icon={ArrowLeft}
          variant="ghost"
          size="sm"
        >
          Back to Incidents
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => extractMemoryFromIncident(incident)}
            icon={Sparkles}
            variant="outline"
            size="sm"
          >
            Extract VAJRA Memory
          </Button>
          <Button
            onClick={() => navigate('/vajra')}
            icon={BrainCircuit}
            variant="primary"
            size="sm"
          >
            Investigate in VAJRA
          </Button>
        </div>
      </div>

      {/* Incident Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-sm font-bold text-cyan-400">{incident.id}</span>
          <Badge variant={incident.severity} size="md">
            {incident.severity} Severity
          </Badge>
          <Badge variant={incident.status} size="md">
            {incident.status}
          </Badge>
          <span className="font-mono text-xs text-slate-400 ml-auto">
            Logged: {incident.reportedDate}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {incident.title}
        </h2>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target Semiconductor:</span>
          <span
            onClick={() => component && navigate(`/components/${component.id}`)}
            className="font-semibold text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            {incident.componentName} ({incident.componentId})
          </span>
        </div>

        <div className="mt-5 p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
            Observed Symptoms & Telemetry Trace
          </span>
          <p className="text-xs text-amber-200 font-mono leading-relaxed">
            {incident.symptoms}
          </p>
        </div>
      </div>

      {/* Detailed Description & Investigation Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Failure Description */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-3">
              Circuit Breakdown & Telemetry Analysis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {incident.description}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Environmental Conditions
                </span>
                <span className="text-slate-200 mt-1 block">
                  {incident.environmentalConditions || 'Standard bench testing envelope'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Assigned Investigator
                </span>
                <span className="text-slate-200 mt-1 block">
                  {incident.assignedEngineer || 'Keshav Gattani'}
                </span>
              </div>
            </div>
          </div>

          {/* Investigation Outcome */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Engineering Resolution & Corrective Actions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {incident.outcome || 'Pending engineering root-cause review.'}
            </p>
            {incident.notes && (
              <p className="mt-3 text-xs text-slate-400 border-l-2 border-emerald-500/40 pl-3 italic">
                Note: {incident.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Associated Memories & Similar Incidents */}
        <div className="space-y-6">
          {/* Associated VAJRA Memories */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                VAJRA Memories ({associatedMemories.length})
              </h3>
            </div>
            {associatedMemories.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                No memories generated yet.
                <Button
                  onClick={() => extractMemoryFromIncident(incident)}
                  size="sm"
                  className="mt-3 w-full"
                >
                  Extract Memory Now
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {associatedMemories.map((mem) => (
                  <div
                    key={mem.id}
                    onClick={() => navigate('/memories')}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-cyan-400">{mem.id}</span>
                      <Badge variant={mem.verificationStatus} size="sm">
                        {mem.verificationStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {mem.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Incidents */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Correlated Historical Events
            </h3>
            {similarIncidents.length === 0 ? (
              <p className="text-xs text-slate-400">No correlated events found.</p>
            ) : (
              <div className="space-y-2.5">
                {similarIncidents.slice(0, 3).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => navigate(`/incidents/${sim.id}`)}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-cyan-400">{sim.id}</span>
                      <Badge variant={sim.severity} size="sm">
                        {sim.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 truncate">{sim.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
