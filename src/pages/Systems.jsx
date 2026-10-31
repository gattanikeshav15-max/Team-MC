import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Cpu,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function Systems() {
  const navigate = useNavigate();
  const { systems, addSystem, deleteSystem, updateSystem } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Avionics / Flight Control',
    description: '',
    componentCount: 0,
    status: 'Nominal',
    reliabilityScore: 98.0,
    location: '',
    leadEngineer: 'Keshav Gattani',
    environment: '',
  });

  const handleOpenAddModal = () => {
    setFormData({
      id: `SYS-${Date.now().toString(36).substring(3, 7).toUpperCase()}`,
      name: '',
      type: 'Avionics / Flight Control',
      description: '',
      componentCount: 0,
      status: 'Nominal',
      reliabilityScore: 98.5,
      location: 'Electronics Bay A',
      leadEngineer: 'Keshav Gattani',
      environment: 'Industrial Standard (-20°C to +70°C)',
    });
    setEditingSystem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (sys, e) => {
    e.stopPropagation();
    setFormData(sys);
    setEditingSystem(sys);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove system ${id}?`)) {
      deleteSystem(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingSystem) {
      updateSystem(editingSystem.id, formData);
    } else {
      addSystem(formData);
    }
    setIsAddModalOpen(false);
  };

  const filteredSystems = systems.filter((sys) => {
    const matchesSearch =
      sys.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sys.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            Electronic Systems Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registered defense, aerospace and autonomous electronic platforms monitored by SiliconSentinel
          </p>
        </div>
        <Button onClick={handleOpenAddModal} icon={Plus} variant="primary">
          Register New System
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search systems by ID, name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Nominal">Nominal</option>
            <option value="Degraded">Degraded</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* Systems Grid */}
      {filteredSystems.length === 0 ? (
        <EmptyState
          title="No electronic systems found"
          description="Try modifying your search query or registering a new platform."
          actionText="Register System"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSystems.map((sys) => (
            <div
              key={sys.id}
              onClick={() => navigate(`/systems/${sys.id}`)}
              className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_4px_25px_rgba(6,182,212,0.12)] cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      {sys.id}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sys.name}
                    </h3>
                  </div>
                  <Badge variant={sys.status} size="sm">
                    {sys.status}
                  </Badge>
                </div>

                <div className="mt-2.5">
                  <span className="inline-block rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                    {sys.type}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {sys.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Components</span>
                    <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      {sys.componentCount} Assigned
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Reliability</span>
                    <span className="font-bold text-emerald-400 mt-0.5 block">
                      {sys.reliabilityScore || 98.4}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Lead: <span className="text-slate-300">{sys.leadEngineer || 'Keshav G.'}</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEditModal(sys, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    title="Edit System"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(sys.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete System"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-1.5 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit System Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingSystem ? `Edit System: ${editingSystem.id}` : 'Register New Electronic System'}
        subtitle="Establish hardware platform profile and operational telemetry baseline."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">System ID</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">System Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Avionics Mission Computer (AMC-V)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">System Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Avionics / Flight Control">Avionics / Flight Control</option>
                <option value="Radar & Signal Processing">Radar & Signal Processing</option>
                <option value="Power Conditioning & Distribution">Power Conditioning & Distribution</option>
                <option value="Perception & Edge Computing">Perception & Edge Computing</option>
                <option value="Deep Cryo Sensing">Deep Cryo Sensing</option>
                <option value="Electronic Warfare / ECM">Electronic Warfare / ECM</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Nominal">Nominal</option>
                <option value="Degraded">Degraded</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description & Role</label>
            <textarea
              rows={3}
              placeholder="Primary engineering mission and hardware architecture envelope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Component Count</label>
              <input
                type="number"
                value={formData.componentCount}
                onChange={(e) => setFormData({ ...formData, componentCount: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lead Engineer</label>
              <input
                type="text"
                value={formData.leadEngineer}
                onChange={(e) => setFormData({ ...formData, leadEngineer: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reliability Score (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.reliabilityScore}
                onChange={(e) => setFormData({ ...formData, reliabilityScore: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Operating Environment Profile</label>
            <input
              type="text"
              placeholder="e.g. Stratospheric Low Pressure (-55°C to +85°C), Radiation Hardened"
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSystem ? 'Save Changes' : 'Register System'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
