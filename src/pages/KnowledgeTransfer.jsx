import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import axios from 'axios';
import {
  Share2,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Download,
  Sparkles,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function KnowledgeTransfer() {
  const { projects } = useAppData();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [researchTopic, setResearchTopic] = useState('');
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await axios.post(`${API_BASE}/knowledge-transfer/report`, {
        targetProjectId: selectedProjectId,
        researchQuery: researchTopic.trim(),
      });

      if (res.data?.report) {
        setReport(res.data.report);
      }
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-5 h-5 text-cyan-400" />
          Cross-Project Knowledge Transfer
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Select your new project (Team B) and synthesize lessons, successful experiments, and failure boundaries from earlier teams (Team A).
        </p>
      </div>

      {/* Generation Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Your Target Project (Team B)
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.teamName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Specific Research Query / Domain (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GaN thermal limits, snubber circuit rules"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-2 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Synthesizing Handoff...' : 'Generate Transfer Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Report Display */}
      {report && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl">
          {/* Report Top Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                {report.reportId}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Knowledge Handoff Report for {report.targetProject?.name || 'New Research Team'}
              </h2>
              <p className="text-xs text-slate-400">Generated on {report.generatedDate}</p>
            </div>

            <div className="text-right text-xs text-slate-400">
              <div>
                Referenced Projects:{' '}
                <strong className="text-slate-200">{report.referencedProjects?.length || 0}</strong>
              </div>
              <div>
                Source Documents:{' '}
                <strong className="text-slate-200">{report.referencedDocuments?.length || 0}</strong>
              </div>
            </div>
          </div>

          {/* 1. Successful Experiments */}
          <div>
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-3">
              <CheckCircle className="w-4 h-4" />
              Successful Experiments & Validated Parameters
            </h3>
            {report.sections?.successfulExperiments?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No validated parameters recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {report.sections.successfulExperiments.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                    <p className="text-slate-200 leading-relaxed font-medium">{item.content}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>
                        From: <strong className="text-slate-300">{item.project}</strong> ({item.team})
                      </span>
                      <span>
                        Source: <em>{item.sourceDoc}</em> ({item.section})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Failed Experiments (Crucial to prevent repeating mistakes) */}
          <div>
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-3">
              <XCircle className="w-4 h-4" />
              Failed Experiments & Critical Hazards (Do Not Repeat)
            </h3>
            {report.sections?.failedExperiments?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No failure modes recorded.</p>
            ) : (
              <div className="space-y-2">
                {report.sections.failedExperiments.map((item, i) => (
                  <div key={i} className="rounded-lg border border-rose-950/40 bg-rose-950/15 p-3 text-xs">
                    <p className="text-rose-200 leading-relaxed font-medium">{item.content}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>
                        From: <strong className="text-slate-300">{item.project}</strong> ({item.team})
                      </span>
                      <span>
                        Source: <em>{item.sourceDoc}</em> ({item.section})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Technical Limitations */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4" />
              Documented Technical Boundaries & Limitations
            </h3>
            {report.sections?.technicalLimitations?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No technical boundaries noted.</p>
            ) : (
              <div className="space-y-2">
                {report.sections.technicalLimitations.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                    <p className="text-slate-200 leading-relaxed">{item.content}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>
                        From: <strong className="text-slate-300">{item.project}</strong> ({item.team})
                      </span>
                      <span>
                        Source: <em>{item.sourceDoc}</em> ({item.section})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Lessons Learned */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-4 h-4" />
              Lessons Learned & Design Directives
            </h3>
            {report.sections?.lessonsLearned?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No lessons recorded.</p>
            ) : (
              <div className="space-y-2">
                {report.sections.lessonsLearned.map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
                    <p className="text-slate-200 leading-relaxed">{item.content}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>
                        From: <strong className="text-slate-300">{item.project}</strong> ({item.team})
                      </span>
                      <span>
                        Source: <em>{item.sourceDoc}</em> ({item.section})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

