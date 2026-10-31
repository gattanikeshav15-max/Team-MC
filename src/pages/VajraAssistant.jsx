import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Plus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertOctagon,
  Sparkles,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function VajraAssistant() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewChat,
    sendMessageToVajra,
    submitFeedback,
  } = useAppData();

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isThinking]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isThinking) return;

    setInputMessage('');
    setIsThinking(true);

    // Simulate AI vector retrieval latency
    setTimeout(async () => {
      await sendMessageToVajra(text, activeConversation.id);
      setIsThinking(false);
    }, 1100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    'What problems have occurred with the EPC2050 GaN transistor under thermal cycling?',
    'Find similar historical failures for FPGA single-event latchups and what was decided.',
    'Summarize the maintenance history and Indium foil specs for space power units.',
    'What engineering memories are associated with Avionics Mission Computer (AMC-V)?',
    'How does cryogenic cooling affect the AD9680 ADC reference bandgap stability?',
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8.5rem)] rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-2xl overflow-hidden animate-in fade-in duration-300">
      {/* Left Sidebar: Conversations & Intelligence Memory Stats */}
      <div className="w-full lg:w-72 border-r border-slate-800/80 bg-slate-900/60 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-sm text-white">VAJRA Sessions</span>
            </div>
            <Button
              onClick={createNewChat}
              size="sm"
              variant="outline"
              icon={Plus}
              className="text-xs"
            >
              New Chat
            </Button>
          </div>

          {/* Conversation List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[48vh] pr-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/40 text-white font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-cyan-400" />
                  <div className="flex-1 truncate">
                    <div className="truncate">{conv.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {conv.timestamp?.split(' ')[1] || 'Session'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VAJRA Agentic Memory Architecture Badge */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
              <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
              Persistent Memory Engine
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Grounded in MongoDB Atlas Vector Search. Responses cite verified component memories.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/40">
        {/* Chat Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeConversation?.messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-4xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                      : 'bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  }`}
                >
                  {isUser ? 'KG' : <BrainCircuit className="w-5 h-5 text-white" />}
                </div>

                {/* Message Bubble */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {isUser ? 'Keshav Gattani (Lead Engineer)' : 'VAJRA Reliability Core'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {msg.timestamp?.split(' ')[1] || msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text}
                    </div>
                  </div>

                  {/* Retrieved Engineering Memories Section (For VAJRA Responses) */}
                  {!isUser && msg.retrievedMemories && msg.retrievedMemories.length > 0 && (
                    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/95 p-4 space-y-3 shadow-lg shadow-cyan-950/20">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            Retrieved Engineering Memories ({msg.retrievedMemories.length})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Vector Distance: 0.089 cosine
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {msg.retrievedMemories.map((mem) => (
                          <div
                            key={mem.id}
                            className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/70 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-cyan-400">
                                  {mem.id}
                                </span>
                                <Badge variant={mem.type} size="sm">
                                  {mem.type}
                                </Badge>
                                <span className="font-mono text-[10px] text-slate-400">
                                  Part: {mem.componentId}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={mem.verificationStatus} size="sm">
                                  {mem.verificationStatus}
                                </Badge>
                                <span className="text-[10px] font-mono text-cyan-400">
                                  Confidence: {mem.confidence}%
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              {mem.content}
                            </p>
                            <div className="mt-2 text-[10px] text-slate-500 font-mono">
                              Source Reference: {mem.source}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Action Buttons (For VAJRA Responses) */}
                  {!isUser && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => submitFeedback(activeConversation.id, msg.id, 'helpful')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                          msg.feedback === 'helpful'
                            ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Helpful
                      </button>

                      <button
                        onClick={() => submitFeedback(activeConversation.id, msg.id, 'not-helpful')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                          msg.feedback === 'not-helpful'
                            ? 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Not Helpful
                      </button>

                      <button
                        onClick={() => submitFeedback(activeConversation.id, msg.id, 'incorrect')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                          msg.feedback === 'incorrect'
                            ? 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Report Incorrect Info
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Vector Retrieval Animation */}
          {isThinking && (
            <div className="flex gap-3.5 max-w-4xl mr-auto animate-pulse">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-md">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-4 text-xs text-cyan-300 flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>
                  VAJRA is executing semantic vector search over MongoDB Atlas engineering memories...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts & Input Area */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 p-4 space-y-3">
          {/* Quick Suggested Questions Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">
              Suggested:
            </span>
            {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full border border-slate-800 bg-slate-950/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors text-[11px] truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="relative flex items-center">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VAJRA about semiconductor failures, latchup mitigation, or memory records (Press Enter to send)..."
              className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/90 pl-4 pr-24 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <Button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isThinking}
                size="sm"
                icon={Send}
              >
                Ask
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

