import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { FolderGit2, CheckCircle, Clock, FileText, Brain, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { projects, markProjectCompleted } = useAppData();
  const [filter, setFilter] = useState('All');

  const filtered = projects.filter((p) => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Research Projects</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore active and completed research projects across all teams.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 p-1">
          {['All', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                filter === tab
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {p.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    p.status === 'Completed'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{p.name}</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1">{p.researchArea}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {p.description || 'No description provided.'}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Team: <span className="text-slate-200 font-semibold">{p.teamName}</span>
              </div>

              <div className="flex items-center gap-2">
                {p.status === 'In Progress' && (
                  <button
                    onClick={() => markProjectCompleted(p.id)}
                    className="text-[11px] rounded-lg border border-emerald-700/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 px-2.5 py-1 font-semibold transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
                <Link
                  to="/add-research"
                  className="text-[11px] rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1 font-semibold"
                >
                  Add Finding
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

