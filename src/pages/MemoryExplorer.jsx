import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Archive,
  Trash2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function MemoryExplorer() {
  const {
    memories,
    components,
    verifyMemory,
    unverifyMemory,
    correctMemory,
    archiveMemory,
    deleteMemory,
    globalSearch,
  } = useAppData();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [componentFilter, setComponentFilter] = useState('All');

  // Selected Memory for Detail Modal
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Correction Modal State
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    id: '',
    content: '',
    reason: '',
  });

  const handleOpenCorrectModal = (mem, e) => {
    if (e) e.stopPropagation();
    setCorrectionForm({
      id: mem.id,
      content: mem.content,
      reason: '',
    });
    setIsCorrectModalOpen(true);
  };

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (!correctionForm.content) return;

    correctMemory(correctionForm.id, {
      content: correctionForm.content,
      reason: correctionForm.reason,
    });

    setIsCorrectModalOpen(false);
    if (selectedMemory?.id === correctionForm.id) {
      setSelectedMemory(null);
    }
  };

  const activeSearch = searchTerm || globalSearch;
  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      !activeSearch ||
      m.content.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.componentId.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.source?.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.tags?.some((t) => t.toLowerCase().includes(activeSearch.toLowerCase()));

    const matchesType = typeFilter === 'All' || m.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || m.verificationStatus === statusFilter;
    const matchesComponent = componentFilter === 'All' || m.componentId === componentFilter;

    return matchesSearch && matchesType && matchesStatus && matchesComponent;
  });

  const memoryTypes = [
    'Observation Memory',
    'Failure Memory',
    'Maintenance Memory',
    'Environmental Memory',
    'Decision Memory',
    'Outcome Memory',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            VAJRA Agentic Memory Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persistent, auditable engineering memory repository with strict verification, correction trails, and TTL lifecycle policies
          </p>
        </div>
      </div>

      {/* Verification Integrity Notice */}
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">Agentic Memory Integrity Protocol</span>
            <span className="text-slate-400">
              Unverified memories represent preliminary hypotheses and are never presented as confirmed fact to downstream mission computers.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            {memories.filter((m) => m.verificationStatus === 'Verified').length} Verified
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            {memories.filter((m) => m.verificationStatus === 'Unverified').length} Unverified
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
            {memories.filter((m) => m.verificationStatus === 'Corrected').length} Corrected
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search memory content, tags, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Memory Categories</option>
            {memoryTypes.map((t) => (
              <option key={t} value={t}>
                {t}
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
            <option value="All">All Verification Statuses</option>
            <option value="Verified">Verified Facts</option>
            <option value="Unverified">Unverified Assumptions</option>
            <option value="Corrected">Corrected Knowledge</option>
            <option value="Archived">Archived Historical</option>
          </select>
        </div>

        {/* Component Filter */}
        <div>
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Semiconductors</option>
            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Memory Table / Cards */}
      {filteredMemories.length === 0 ? (
        <EmptyState
          title="No engineering memories found"
          description="Try broadening your search or change verification filters."
          icon={Database}
        />
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Memory ID</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Component</th>
                  <th className="py-3 px-4 font-semibold">Heuristic / Memory Content</th>
                  <th className="py-3 px-4 font-semibold">Confidence</th>
                  <th className="py-3 px-4 font-semibold">Verification</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMemories.map((mem) => (
                  <tr
                    key={mem.id}
                    onClick={() => setSelectedMemory(mem)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {mem.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={mem.type} size="sm">
                        {mem.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                      {mem.componentId}
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="line-clamp-2 text-slate-200 leading-relaxed font-normal">
                        {mem.content}
                      </p>
                      <div className="mt-1 text-[10px] text-slate-500 font-mono">
                        Source: {mem.source}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-cyan-400">{mem.confidence}%</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={mem.verificationStatus} size="sm">
                        {mem.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {mem.verificationStatus !== 'Verified' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              verifyMemory(mem.id);
                            }}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40"
                            title="Verify Memory"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              unverifyMemory(mem.id);
                            }}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-950/40"
                            title="Mark as Unverified"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={(e) => handleOpenCorrectModal(mem, e)}
                          className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-950/40"
                          title="Correct Memory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveMemory(mem.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                          title="Archive"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Permanently purge memory ${mem.id}?`)) {
                              deleteMemory(mem.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
                          title="Purge"
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

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <Modal
          isOpen={!!selectedMemory}
          onClose={() => setSelectedMemory(null)}
          title={`Memory Trace: ${selectedMemory.id}`}
          subtitle={`Stored in MongoDB Vector Collection • Created ${selectedMemory.createdDate}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Badge variant={selectedMemory.type} size="sm">
                  {selectedMemory.type}
                </Badge>
                <Badge variant={selectedMemory.verificationStatus} size="sm">
                  {selectedMemory.verificationStatus}
                </Badge>
              </div>
              <div className="font-mono text-cyan-400">
                Confidence: {selectedMemory.confidence}% | Importance: {selectedMemory.importance}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                Engineering Memory Content (Vector Search Anchor)
              </span>
              <p className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 text-sm leading-relaxed">
                {selectedMemory.content}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                  Target Semiconductor Part
                </span>
                <div className="font-semibold text-white">
                  {selectedMemory.componentName || selectedMemory.componentId}
                </div>
                <div className="font-mono text-[10px] text-cyan-400">{selectedMemory.componentId}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                  Telemetry / Incident Source
                </span>
                <div className="font-mono text-slate-300">{selectedMemory.source}</div>
              </div>
            </div>

            {selectedMemory.notes && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                  Audit Notes & Verification Logs
                </span>
                <p className="text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 italic">
                  {selectedMemory.notes}
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenCorrectModal(selectedMemory)}
                  icon={Edit2}
                >
                  Correct Heuristic
                </Button>
                {selectedMemory.verificationStatus !== 'Verified' ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      verifyMemory(selectedMemory.id);
                      setSelectedMemory(null);
                    }}
                    icon={CheckCircle2}
                  >
                    Verify as Fact
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      unverifyMemory(selectedMemory.id);
                      setSelectedMemory(null);
                    }}
                    icon={AlertTriangle}
                  >
                    Mark Unverified
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMemory(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Correct Memory Form Modal */}
      <Modal
        isOpen={isCorrectModalOpen}
        onClose={() => setIsCorrectModalOpen(false)}
        title={`Apply Correction: ${correctionForm.id}`}
        subtitle="Refines heuristic text, updates MongoDB vector embedding, and registers audit record."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Corrected Technical Content
            </label>
            <textarea
              rows={4}
              required
              value={correctionForm.content}
              onChange={(e) => setCorrectionForm({ ...correctionForm, content: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Correction Reason & Physical Justification
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Destructive physical analysis confirmed moisture leakage rather than internal die ionic breakdown"
              value={correctionForm.reason}
              onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-200">
            <span className="font-semibold block mb-0.5">Audit Trail Guarantee:</span>
            The memory will be tagged with status <strong>Corrected</strong> and include your timestamp and justification in the immutable engineering audit log.
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsCorrectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Commit Correction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
