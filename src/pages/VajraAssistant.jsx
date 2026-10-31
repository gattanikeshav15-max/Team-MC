import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import axios from 'axios';
import { Send, BrainCircuit, Sparkles, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function VajraAssistant() {
  const { projects } = useAppData();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'vajra',
      text: 'Hello! I am **VAJRA**, the research memory assistant of SiliconSentinel.\n\nAsk me about previous research findings, successful thermal dissipation parameters, failed experiments, or design boundaries from earlier teams before starting your new project.',
      retrievedMemories: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/ai/chat`, {
        message: userText,
      });

      if (res.data?.vajraMessage) {
        setMessages((prev) => [...prev, res.data.vajraMessage]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'vajra',
          text: `⚠️ Error consulting VAJRA: ${err.response?.data?.message || err.message}`,
          retrievedMemories: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            VAJRA AI Memory Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Query across all historical research projects with grounded source document provenance.
          </p>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
          Vector Index Synced
        </span>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none font-medium'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Display Cited Memories & Sources */}
              {msg.retrievedMemories && msg.retrievedMemories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Cited Historical Research Memories ({msg.retrievedMemories.length})
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.retrievedMemories.map((mem) => (
                      <div
                        key={mem.id}
                        className="rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300">
                            {mem.category} • {mem.projectName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              mem.verificationStatus === 'Verified'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {mem.verificationStatus}
                          </span>
                        </div>
                        <p className="text-slate-400">{mem.content}</p>
                        <div className="text-[9px] text-slate-400 pt-1">
                          Source: <em>{mem.documentName}</em> ({mem.sourceSection || 'Section'})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold p-3 bg-slate-900/50 rounded-xl w-fit border border-slate-800">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            VAJRA is searching previous research memories and synthesizing evidence...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask e.g. What were the key thermal failure modes and solutions found in GaN research?"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
        >
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
}
