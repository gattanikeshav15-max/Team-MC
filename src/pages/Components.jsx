import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function Components() {
  const navigate = useNavigate();
  const { components, systems, addComponent, deleteComponent, updateComponent, globalSearch } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [systemFilter, setSystemFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  // Form State for Registering Component
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    manufacturer: '',
    partNumber: '',
    category: 'Wide Bandgap Semiconductors',
    systemId: '',
    status: 'Nominal',
    description: '',
    voltageRating: '350V Vds',
    tempRange: '-55°C to +125°C',
    radiationHardness: 'TID > 50 krad',
    packageType: 'Passivated BGA',
  });

  const handleOpenRegister = () => {
    setFormData({
      id: `CMP-${Date.now().toString(36).substring(2, 6).toUpperCase()}`,
      name: '',
      manufacturer: '',
      partNumber: '',
      category: 'Wide Bandgap Semiconductors',
      systemId: systems[0]?.id || '',
      status: 'Nominal',
      description: '',
      voltageRating: '350V Vds',
      tempRange: '-55°C to +125°C',
      radiationHardness: 'TID > 50 krad',
      packageType: 'Ceramic QFP',
    });
    setEditingComponent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (comp, e) => {
    e.stopPropagation();
    setFormData({
      id: comp.id,
      name: comp.name,
      manufacturer: comp.manufacturer,
      partNumber: comp.partNumber,
      category: comp.category,
      systemId: comp.systemId,
      status: comp.status,
      description: comp.description,
      voltageRating: comp.technicalSpecs?.voltageRating || '',
      tempRange: comp.technicalSpecs?.tempRange || '',
      radiationHardness: comp.technicalSpecs?.radiationHardness || '',
      packageType: comp.technicalSpecs?.packageType || '',
    });
    setEditingComponent(comp);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove component ${id}?`)) {
      deleteComponent(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.manufacturer) return;

    const compPayload = {
      ...formData,
      technicalSpecs: {
        voltageRating: formData.voltageRating,
        tempRange: formData.tempRange,
        radiationHardness: formData.radiationHardness,
        packageType: formData.packageType,
      },
    };

    if (editingComponent) {
      updateComponent(editingComponent.id, compPayload);
    } else {
      addComponent(compPayload);
    }
    setIsAddModalOpen(false);
  };

  // Filter components
  const activeSearch = searchTerm || globalSearch;
  const filteredComponents = components.filter((comp) => {
    const matchesSearch =
      !activeSearch ||
      comp.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      comp.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      comp.manufacturer.toLowerCase().includes(activeSearch.toLowerCase()) ||
      comp.partNumber.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
    const matchesSystem = systemFilter === 'All' || comp.systemId === systemFilter;
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;

    return matchesSearch && matchesCategory && matchesSystem && matchesStatus;
  });

  const categories = [
    'Wide Bandgap Semiconductors',
    'Microcontrollers & SoCs',
    'FPGAs & Accelerators',
    'RF & Mixed Signal',
    'Power Management ICs',
    'Precision Analog',
    'Memory & Storage',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Semiconductor Component Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Component-level reliability tracking, semiconductor physics specs, and failure history
          </p>
        </div>
        <Button onClick={handleOpenRegister} icon={Plus} variant="primary">
          Register Component
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by part#, name, maker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* System Filter */}
        <div>
          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Systems</option>
            {systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Nominal">Nominal</option>
            <option value="Degraded">Degraded</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Component Table */}
      {filteredComponents.length === 0 ? (
        <EmptyState
          title="No semiconductor components match filters"
          description="Try relaxing your filter parameters or register a new part."
          actionText="Register Component"
          onAction={handleOpenRegister}
          icon={Cpu}
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Component ID</th>
                  <th className="py-3 px-4 font-semibold">Component Name</th>
                  <th className="py-3 px-4 font-semibold">Manufacturer & Part#</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Assigned System</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Incidents</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredComponents.map((comp) => (
                  <tr
                    key={comp.id}
                    onClick={() => navigate(`/components/${comp.id}`)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {comp.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {comp.name}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div className="font-medium text-slate-200">{comp.manufacturer}</div>
                      <div className="font-mono text-[10px] text-slate-400">{comp.partNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">
                        {comp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[160px] truncate">
                      {comp.systemName || comp.systemId}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={comp.status} size="sm">
                        {comp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center font-mono font-bold text-xs rounded-full px-2 py-0.5 ${
                          comp.incidentCount > 2
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : comp.incidentCount > 0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {comp.incidentCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => handleOpenEdit(comp, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                          title="Edit Specs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(comp.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete Component"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Component Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingComponent ? `Edit Component: ${editingComponent.id}` : 'Register Semiconductor Component'}
        subtitle="Catalog technical specifications, thermal limits, and associate with a target electronic system."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Component ID</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Component Name</label>
              <input
                type="text"
                required
                placeholder="e.g. EPC2050 GaN Power Transistor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Manufacturer</label>
              <input
                type="text"
                required
                placeholder="e.g. Efficient Power Conversion"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Part Number</label>
              <input
                type="text"
                required
                placeholder="e.g. EPC2050-ENH-350V"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Associated System</label>
              <select
                value={formData.systemId}
                onChange={(e) => setFormData({ ...formData, systemId: e.target.value })}
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
              <label className="block text-slate-300 font-semibold mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Nominal">Nominal</option>
                <option value="Degraded">Degraded</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Technical Specs Group */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
            <span className="text-[11px] font-bold text-cyan-400 font-mono uppercase block">
              Semiconductor Technical Specifications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Voltage / Current Rating</label>
                <input
                  type="text"
                  placeholder="e.g. 350V Vds, 30A"
                  value={formData.voltageRating}
                  onChange={(e) => setFormData({ ...formData, voltageRating: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Thermal Range</label>
                <input
                  type="text"
                  placeholder="e.g. -55°C to +150°C"
                  value={formData.tempRange}
                  onChange={(e) => setFormData({ ...formData, tempRange: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Radiation Tolerance</label>
                <input
                  type="text"
                  placeholder="e.g. TID 100 krad, SEL Immune"
                  value={formData.radiationHardness}
                  onChange={(e) => setFormData({ ...formData, radiationHardness: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Package Type</label>
                <input
                  type="text"
                  placeholder="e.g. Passivated Die BGA"
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Functional Description</label>
            <textarea
              rows={2}
              placeholder="Engineering function inside target subsystem circuit..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingComponent ? 'Save Specifications' : 'Register Component'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

