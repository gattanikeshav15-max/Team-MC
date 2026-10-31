import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  Cpu,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  User,
  Calendar,
  Activity,
  Plus,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function SystemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { systems, components, incidents } = useAppData();

  const system = systems.find((s) => s.id === id);

  if (!system) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold text-white">System Not Found</h3>
        <p className="text-xs text-slate-400 mt-2 mb-4">No system matches identifier {id}</p>
        <Button onClick={() => navigate('/systems')} variant="secondary">
          Return to Systems Registry
        </Button>
      </div>
    );
  }

  // Find components assigned to this system
  const assignedComponents = components.filter((c) => c.systemId === system.id);

  // Find incidents related to this system
  const systemIncidents = incidents.filter(
    (inc) =>
      inc.systemId === system.id ||
      assignedComponents.some((c) => c.id === inc.componentId)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate('/systems')}
          icon={ArrowLeft}
          variant="ghost"
          size="sm"
        >
          Back to Systems
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/components')}
            icon={Plus}
            variant="outline"
            size="sm"
          >
            Assign Component
          </Button>
          <Button
            onClick={() => navigate('/incidents')}
            icon={AlertTriangle}
            variant="secondary"
            size="sm"
          >
            Report Incident
          </Button>
        </div>
      </div>

      {/* System Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-cyan-400">{system.id}</span>
              <Badge variant={system.status} size="md">
                {system.status}
              </Badge>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              {system.name}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {system.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {system.location || 'Flight Avionics Bay'}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-400" />
                Lead: {system.leadEngineer || 'Keshav Gattani'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Registered: {system.registrationDate}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5 text-center min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reliability Score
            </span>
            <div className="mt-2 text-3xl font-black text-emerald-400">
              {system.reliabilityScore || 98.4}%
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Fleet Index Verified
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Allocated Components & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocated Components (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Allocated Semiconductors & Modules ({assignedComponents.length})
              </h3>
              <p className="text-xs text-slate-400">Active component roster integrated into this platform</p>
            </div>
          </div>

          {assignedComponents.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No components directly linked to this system. Use the Component Registry to assign parts.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {assignedComponents.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => navigate(`/components/${comp.id}`)}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-3 rounded-xl transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-cyan-400">
                        {comp.id}
                      </span>
                      <span className="font-bold text-sm text-white">
                        {comp.name}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                      <span>{comp.manufacturer}</span>
                      <span>•</span>
                      <span>{comp.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      {comp.incidentCount} Anomaly
                    </span>
                    <Badge variant={comp.status} size="sm">
                      {comp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operating Envelope & Incidents (1 col) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Operating Environment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {system.environment || 'Standard Aerospace Spec: -55°C to +85°C, Vibration Profile MIL-STD-810H'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                System Anomaly Log ({systemIncidents.length})
              </h3>
            </div>
            {systemIncidents.length === 0 ? (
              <p className="text-xs text-slate-400">Zero incidents recorded for this system.</p>
            ) : (
              <div className="space-y-2.5">
                {systemIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-cyan-400">{inc.id}</span>
                      <Badge variant={inc.severity} size="sm">
                        {inc.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-200 truncate">{inc.title}</p>
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
