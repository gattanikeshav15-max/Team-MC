import React, { useState, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import api from '../services/api';
import {
  Send,
  BrainCircuit,
  Sparkles,
  BookOpen,
  Plus,
  MessageSquare,
  FileText,
  Upload,
  FolderGit2,
} from 'lucide-react';

export default function VajraAssistant() {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    projectChats,
    activeChatId,
    setActiveChatId,
    createChat,
    uploadDocument,
  } = useAppData();

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Load active chat messages from MongoDB
  useEffect(() => {
    if (!activeChatId) {
      setMessages([
        {
          id: 'welcome',
          sender: 'vajra',
          text: `Welcome! Please select a project or start a new consultation chat on the left to consult historical research.`,
          retrievedMemories: [],
          uploadedDocuments: [],
        },
      ]);
      return;
    }

    const fetchChatMessages = async () => {
      try {
        const res = await api.get(`/api/ai/conversations/${activeChatId}`);
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.warn('Could not load chat messages:', err.message);
      }
    };

    fetchChatMessages();
  }, [activeChatId]);

  const handleCreateNewChat = async () => {
    if (!selectedProjectId) return;
    const title = prompt('Enter a title for this research chat:', `Consultation #${projectChats.length + 1}`);
    if (title) {
      await createChat(selectedProjectId, title);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading || !selectedProjectId) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      uploadedDocuments: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        message: userText,
        projectId: selectedProjectId,
        conversationId: activeChatId,
      });

      if (res.data?.vajraMessage) {
        setMessages((prev) => [...prev, res.data.vajraMessage]);
        if (!activeChatId && res.data.conversationId) {
          setActiveChatId(res.data.conversationId);
        }
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

  const handleChatFileUpload = async (e) => {
    e.preventDefault();
    if (!fileToUpload || !selectedProjectId || !activeChatId) return;

    setIsUploadingFile(true);
    try {
      await uploadDocument(selectedProjectId, fileToUpload, activeChatId);
      setShowUploadModal(false);
      setFileToUpload(null);

      // Refresh chat messages to reflect document inclusion
      const res = await api.get(`/api/ai/conversations/${activeChatId}`);
      if (res.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Chat file upload failed:', err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-3">
      {/* Top Project Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">VAJRA AI Assistant</h1>
            <p className="text-[11px] text-slate-400">
              Cross-project persistent memory and grounded research citations.
            </p>
          </div>
        </div>

        {/* Project Context Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            Project Context:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.teamName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout: Project Chats Sidebar + Chat Conversation */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Left Column: Project Chats List (User ➔ Project ➔ Multiple Chats) */}
        <div className="w-64 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-3 shrink-0">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Project Chats ({projectChats.length})
            </span>
            <button
              onClick={handleCreateNewChat}
              className="p-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
              title="Start New Chat under this Project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {projectChats.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No chats created yet.
                <button
                  onClick={handleCreateNewChat}
                  className="mt-2 block mx-auto text-cyan-400 hover:underline font-semibold"
                >
                  + Create Chat
                </button>
              </div>
            ) : (
              projectChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`w-full text-left rounded-lg p-2.5 text-xs transition-colors flex items-center gap-2 ${
                    activeChatId === c.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input */}
        <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 p-4 overflow-hidden">
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

                  {/* Uploaded Documents in this Message */}
                  {msg.uploadedDocuments && msg.uploadedDocuments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-semibold">Attached:</span>
                      {msg.uploadedDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded bg-slate-950 px-2 py-0.5 text-[10px] text-cyan-300 border border-slate-800"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          {doc.filename || doc.id}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Display Cited Memories & Provenance */}
                  {msg.retrievedMemories && msg.retrievedMemories.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Cited Historical Research Findings ({msg.retrievedMemories.length})
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.retrievedMemories.map((mem) => (
                          <div
                            key={mem.id}
                            className="rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-300">
                                {mem.category} • {mem.projectName} ({mem.teamName})
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
                              Source Doc: <em>{mem.documentName}</em> ({mem.sourceSection || 'Section'})
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
                VAJRA is searching cross-project memories and synthesizing evidence...
              </div>
            )}
          </div>

          {/* Input & Attach Bar */}
          <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-slate-800 items-center">
            {activeChatId && (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white p-2.5 transition-colors"
                title="Attach Document to this Chat"
              >
                <Upload className="w-4 h-4" />
              </button>
            )}

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask VAJRA regarding ${activeProject?.name || 'research findings'}...`}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading || !selectedProjectId}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Modal: Attach File into Current Chat */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Upload Document to Current Chat</h3>
            <p className="text-xs text-slate-400 mb-4">
              File will be stored persistently in MongoDB GridFS and extracted into this chat's research memory.
            </p>

            <form onSubmit={handleChatFileUpload} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv"
                onChange={(e) => setFileToUpload(e.target.files[0])}
                className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!fileToUpload || isUploadingFile}
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-1.5 text-xs font-bold disabled:bg-slate-800"
                >
                  {isUploadingFile ? 'Uploading to GridFS...' : 'Upload & Extract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
