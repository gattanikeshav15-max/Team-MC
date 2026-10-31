import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { UploadCloud, FileCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AddResearch() {
  const { projects, uploadDocument, memories, verifyMemory } = useAppData();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResult, setUploadedResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedProjectId || !file) return;

    setIsUploading(true);
    setUploadedResult(null);

    try {
      const res = await uploadDocument(selectedProjectId, file);
      setUploadedResult(res);
      setFile(null);
    } catch (err) {
      // Error handled in context toast
    } finally {
      setIsUploading(false);
    }
  };

  // Recent memories for the selected project
  const projectMemories = memories.filter((m) => m.projectId === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Add Research & Documents</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Upload PDF, DOCX, TXT, or CSV reports. VAJRA will automatically extract structured research findings into persistent memory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            Upload Research File
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Project</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document File</label>
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/50">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-300">
                  {file ? file.name : 'Click or drag PDF, DOCX, TXT, CSV'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Maximum file size: 25MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || isUploading || !selectedProjectId}
              className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all shadow-md ${
                isUploading || !file
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isUploading ? 'Extracting Findings...' : 'Upload & Process with VAJRA'}
            </button>
          </form>

          {/* Success Banner */}
          {uploadedResult && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Autonomous Extraction Completed!
              </div>
              <p className="text-[11px] text-slate-300">
                Extracted <strong>{uploadedResult.memoriesCount}</strong> research memories from{' '}
                <em>{uploadedResult.document?.originalFilename}</em>.
              </p>
            </div>
          )}
        </div>

        {/* Extracted Findings Preview */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Extracted Research Findings ({projectMemories.length})
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              Filter: {projects.find((p) => p.id === selectedProjectId)?.name || 'Project'}
            </span>
          </div>

          {projectMemories.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              No findings extracted for this project yet. Upload a research document on the left.
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {projectMemories.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.category === 'Successful Experiment'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : m.category === 'Failed Experiment'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : m.category === 'Technical Limitation'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {m.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        Confidence: <strong className="text-slate-200">{m.confidence}%</strong>
                      </span>
                      {m.verificationStatus === 'Verified' ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyMemory(m.id)}
                          className="text-[10px] font-bold text-amber-400 hover:text-emerald-400 border border-amber-800/60 hover:border-emerald-700 bg-amber-950/30 px-2 py-0.5 rounded transition-colors"
                        >
                          Confirm & Verify
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-normal">{m.content}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>
                      Doc: <strong className="text-slate-300">{m.documentName || 'Direct Extraction'}</strong>
                    </span>
                    <span>{m.sourceSection || 'Section 1.0'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

