import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  CheckCircle2,
  FileText,
  Brain,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Dashboard() {
  const { stats, projects, addProject } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    researchArea: '',
    teamName: '',
    description: '',
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.teamName) return;
    await addProject(newProject);
    setShowModal(false);
    setNewProject({ name: '', researchArea: '', teamName: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            VAJRA Research Memory Core
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">Research Intelligence Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Knowledge completed by previous teams automatically powers next-generation engineering research.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 text-sm transition-colors shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Start New Project
        </button>
      </div>

      {/* 4 Clean Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalProjects || 0}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completed Projects</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.completedProjects || 0}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Documents Ingested</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalDocuments || 0}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Saved Memories</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalMemories || 0}</div>
        </div>
      </div>

      {/* Recently Added Projects */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recently Added Projects</h2>
          <Link to="/projects" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">No research projects created yet.</div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-900/70 p-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {p.researchArea} • <span className="text-slate-300 font-medium">{p.teamName}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/add-research"
                    className="text-xs rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:text-white"
                  >
                    Upload Research
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Start New Project */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Start New Research Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GaN Inverter Thermal Analysis"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Research Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semiconductor Reliability"
                  value={newProject.researchArea}
                  onChange={(e) => setNewProject({ ...newProject, researchArea: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Research Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Alpha / Power Division"
                  value={newProject.teamName}
                  onChange={(e) => setNewProject({ ...newProject, teamName: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of research goals..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
