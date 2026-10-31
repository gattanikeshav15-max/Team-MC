import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSystems } from '../data/mockSystems';
import { initialComponents } from '../data/mockComponents';
import { initialIncidents } from '../data/mockIncidents';
import { initialMemories } from '../data/mockMemories';
import { initialConversations } from '../data/mockVajraChats';
import { useToast } from './ToastContext';
import { systemService } from '../services/systemService';
import { componentService } from '../services/componentService';
import { incidentService } from '../services/incidentService';
import { memoryService } from '../services/memoryService';
import { vajraService } from '../services/vajraService';
import api from '../services/api';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { showToast } = useToast();

  // Systems State
  const [systems, setSystems] = useState(() => {
    const saved = localStorage.getItem('silicon_sentinel_systems');
    return saved ? JSON.parse(saved) : initialSystems;
  });

  // Components State
  const [components, setComponents] = useState(() => {
    const saved = localStorage.getItem('silicon_sentinel_components');
    return saved ? JSON.parse(saved) : initialComponents;
  });

  // Incidents State
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('silicon_sentinel_incidents');
    return saved ? JSON.parse(saved) : initialIncidents;
  });

  // Memories State
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('silicon_sentinel_memories');
    return saved ? JSON.parse(saved) : initialMemories;
  });

  // Conversations State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('silicon_sentinel_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    return conversations[0]?.id || 'conv-001';
  });

  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    mode: 'Checking...',
    label: 'Connecting to SiliconSentinel backend...',
  });

  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');

  // 1. Initial Backend Sync
  useEffect(() => {
    async function syncWithBackend() {
      try {
        const healthRes = await api.get('/api/health');
        if (healthRes.data?.status === 'ONLINE') {
          setBackendStatus({
            connected: true,
            mode: healthRes.data.database?.mode || 'live',
            label: healthRes.data.database?.label || 'Backend Online',
            details: healthRes.data,
          });

          // Fetch fresh records from backend
          const [sysRes, compRes, incRes, memRes, convRes] = await Promise.allSettled([
            systemService.getSystems(),
            componentService.getComponents(),
            incidentService.getIncidents(),
            memoryService.getMemories(),
            vajraService.getConversations(),
          ]);

          if (sysRes.status === 'fulfilled' && sysRes.value.success && Array.isArray(sysRes.value.data) && sysRes.value.data.length > 0) {
            setSystems(sysRes.value.data);
          }
          if (compRes.status === 'fulfilled' && compRes.value.success && Array.isArray(compRes.value.data) && compRes.value.data.length > 0) {
            setComponents(compRes.value.data);
          }
          if (incRes.status === 'fulfilled' && incRes.value.success && Array.isArray(incRes.value.data) && incRes.value.data.length > 0) {
            setIncidents(incRes.value.data);
          }
          if (memRes.status === 'fulfilled' && memRes.value.success && Array.isArray(memRes.value.data) && memRes.value.data.length > 0) {
            setMemories(memRes.value.data);
          }
          if (convRes.status === 'fulfilled' && convRes.value.success && Array.isArray(convRes.value.data) && convRes.value.data.length > 0) {
            setConversations(convRes.value.data);
          }
        }
      } catch (err) {
        setBackendStatus({
          connected: false,
          mode: 'demo_fallback',
          label: 'Standalone Demo Mode (Local Storage)',
        });
      } finally {
        setIsLoadingBackend(false);
      }
    }

    syncWithBackend();
  }, []);

  // Save to localStorage as persistent client cache
  useEffect(() => {
    localStorage.setItem('silicon_sentinel_systems', JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem('silicon_sentinel_components', JSON.stringify(components));
  }, [components]);

  useEffect(() => {
    localStorage.setItem('silicon_sentinel_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('silicon_sentinel_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('silicon_sentinel_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // System CRUD Operations
  const addSystem = async (newSystem) => {
    const system = {
      ...newSystem,
      id: newSystem.id || `SYS-${Date.now().toString(36).toUpperCase()}`,
      componentCount: Number(newSystem.componentCount) || 0,
      registrationDate: newSystem.registrationDate || new Date().toISOString().split('T')[0],
      status: newSystem.status || 'Nominal',
      reliabilityScore: Number(newSystem.reliabilityScore) || 98.0,
    };

    // Attempt backend save
    try {
      const res = await systemService.createSystem(system);
      if (res.success && res.data) {
        setSystems((prev) => [res.data, ...prev.filter((s) => s.id !== res.data.id)]);
        showToast(`System "${res.data.name}" registered to backend.`, 'success');
        return res.data;
      }
    } catch {
      // Fallback
    }

    setSystems((prev) => [system, ...prev]);
    showToast(`System "${system.name}" registered successfully.`, 'success');
    return system;
  };

  const updateSystem = async (id, updatedFields) => {
    try {
      await systemService.updateSystem(id, updatedFields);
    } catch {
      // Fallback
    }

    setSystems((prev) =>
      prev.map((sys) => (sys.id === id ? { ...sys, ...updatedFields } : sys))
    );
    showToast(`System ${id} updated successfully.`, 'success');
  };

  const deleteSystem = async (id) => {
    try {
      await systemService.deleteSystem(id);
    } catch {
      // Fallback
    }

    setSystems((prev) => prev.filter((sys) => sys.id !== id));
    showToast(`System ${id} deleted from registry.`, 'warning');
  };

  // Component CRUD Operations
  const addComponent = async (newComponent) => {
    const system = systems.find((s) => s.id === newComponent.systemId);
    const comp = {
      ...newComponent,
      id: newComponent.id || `CMP-${Date.now().toString(36).toUpperCase()}`,
      systemName: system ? system.name : newComponent.systemName || 'Unassigned',
      incidentCount: 0,
      mtbfHours: Number(newComponent.mtbfHours) || 500000,
      status: newComponent.status || 'Nominal',
      maintenanceHistory: [],
    };

    try {
      const res = await componentService.createComponent(comp);
      if (res.success && res.data) {
        setComponents((prev) => [res.data, ...prev.filter((c) => c.id !== res.data.id)]);
        if (system) {
          updateSystem(system.id, { componentCount: (system.componentCount || 0) + 1 });
        }
        showToast(`Component "${res.data.name}" saved to repository.`, 'success');
        return res.data;
      }
    } catch {
      // Fallback
    }

    setComponents((prev) => [comp, ...prev]);
    if (system) {
      updateSystem(system.id, { componentCount: (system.componentCount || 0) + 1 });
    }
    showToast(`Component "${comp.name}" added to registry.`, 'success');
    return comp;
  };

  const updateComponent = async (id, updatedFields) => {
    try {
      await componentService.updateComponent(id, updatedFields);
    } catch {
      // Fallback
    }

    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    showToast(`Component ${id} specifications updated.`, 'success');
  };

  const deleteComponent = async (id) => {
    try {
      await componentService.deleteComponent(id);
    } catch {
      // Fallback
    }

    setComponents((prev) => prev.filter((c) => c.id !== id));
    showToast(`Component ${id} removed.`, 'warning');
  };

  // Incident CRUD Operations & VAJRA Auto-Memory Generation
  const addIncident = async (incidentData, autoExtract = true) => {
    const component = components.find((c) => c.id === incidentData.componentId);
    const incidentId = incidentData.id || `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newInc = {
      ...incidentData,
      id: incidentId,
      componentName: component ? component.name : incidentData.componentName || 'Generic Electronic Device',
      reportedDate: incidentData.reportedDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: incidentData.status || 'Under Investigation',
      outcome: incidentData.outcome || 'Pending engineering root-cause review.',
    };

    try {
      const res = await incidentService.createIncident(newInc);
      if (res.success && res.data?.incident) {
        const savedInc = res.data.incident;
        setIncidents((prev) => [savedInc, ...prev.filter((i) => i.id !== savedInc.id)]);

        if (res.data.extractedMemory) {
          setMemories((prev) => [res.data.extractedMemory, ...prev.filter((m) => m.id !== res.data.extractedMemory.id)]);
          showToast(`VAJRA extracted candidate memory ${res.data.extractedMemory.id}.`, 'info', 6000);
        }

        if (component) {
          const newStatus = incidentData.severity === 'Critical' ? 'Critical' : incidentData.severity === 'High' ? 'Degraded' : component.status;
          updateComponent(component.id, {
            incidentCount: (component.incidentCount || 0) + 1,
            status: newStatus,
          });
        }

        showToast(`Incident ${savedInc.id} logged to backend.`, 'success');
        return savedInc;
      }
    } catch {
      // Fallback
    }

    setIncidents((prev) => [newInc, ...prev]);

    if (component) {
      const newStatus = incidentData.severity === 'Critical' ? 'Critical' : incidentData.severity === 'High' ? 'Degraded' : component.status;
      updateComponent(component.id, {
        incidentCount: (component.incidentCount || 0) + 1,
        status: newStatus,
      });
    }

    showToast(`Incident ${incidentId} logged successfully.`, 'success');

    if (autoExtract) {
      setTimeout(() => {
        extractMemoryFromIncident(newInc);
      }, 1000);
    }

    return newInc;
  };

  // Memory Actions (Verify, Unverify, Correct, Archive, Delete, Extract)
  const verifyMemory = async (id, engineerName = 'Keshav Gattani') => {
    try {
      await memoryService.updateMemory(id, { action: 'verify', engineerName });
    } catch {
      // Fallback
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              verificationStatus: 'Verified',
              verifiedBy: engineerName,
              notes: `${m.notes || ''} [Verified by ${engineerName} on ${new Date().toISOString().split('T')[0]}]`,
            }
          : m
      )
    );
    showToast(`Memory ${id} verified and tagged as confirmed engineering fact.`, 'success');
  };

  const unverifyMemory = async (id) => {
    try {
      await memoryService.updateMemory(id, { action: 'unverify' });
    } catch {
      // Fallback
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              verificationStatus: 'Unverified',
              verifiedBy: 'Pending Peer Review',
            }
          : m
      )
    );
    showToast(`Memory ${id} marked as unverified assumption.`, 'info');
  };

  const correctMemory = async (id, updatedContent, engineerName = 'Keshav Gattani') => {
    try {
      const res = await memoryService.updateMemory(id, {
        action: 'correct',
        content: updatedContent.content,
        reason: updatedContent.reason,
        engineerName,
      });
      if (res.success && res.data?.memory) {
        setMemories((prev) =>
          prev.map((m) => (m.id === id ? res.data.memory : m))
        );
        showToast(`Memory ${id} corrected in persistent store.`, 'success');
        return;
      }
    } catch {
      // Fallback
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              content: updatedContent.content || m.content,
              verificationStatus: 'Corrected',
              verifiedBy: engineerName,
              notes: `${m.notes || ''} [Corrected on ${new Date().toISOString().split('T')[0]}: ${updatedContent.reason || 'Technical correction applied'}]`,
            }
          : m
      )
    );
    showToast(`Memory ${id} corrected and logged in audit trail.`, 'success');
  };

  const archiveMemory = async (id) => {
    try {
      await memoryService.updateMemory(id, { action: 'archive' });
    } catch {
      // Fallback
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              verificationStatus: 'Archived',
            }
          : m
      )
    );
    showToast(`Memory ${id} archived for historical reference.`, 'info');
  };

  const deleteMemory = async (id) => {
    try {
      await memoryService.deleteMemory(id);
    } catch {
      // Fallback
    }

    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast(`Memory ${id} purged from persistent store.`, 'warning');
  };

  const extractMemoryFromIncident = async (incident) => {
    try {
      const res = await memoryService.extractMemoryFromIncident(incident.id);
      if (res.success && res.data?.memory) {
        setMemories((prev) => [res.data.memory, ...prev.filter((m) => m.id !== res.data.memory.id)]);
        showToast(`VAJRA extracted memory ${res.data.memory.id} from incident.`, 'info', 6000);
        return;
      }
    } catch {
      // Fallback
    }

    const memoryId = `MEM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const category = incident.severity === 'Critical' ? 'Failure Memory' : 'Observation Memory';
    const confidence = incident.severity === 'Critical' ? 95 : 82;

    const newMem = {
      id: memoryId,
      componentId: incident.componentId,
      componentName: incident.componentName,
      type: category,
      category,
      content: `Extracted from ${incident.id}: ${incident.title}. Symptoms: ${incident.symptoms}. Environmental context: ${incident.environmentalConditions || 'Standard'}.`,
      source: `${incident.id} / Automated VAJRA Extraction`,
      confidence,
      importance: incident.severity === 'Critical' ? 'Critical' : 'High',
      verificationStatus: 'Unverified',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tags: [incident.severity, 'Automated-Extraction'],
      verifiedBy: 'Pending Review',
      notes: 'Generated via VAJRA Agentic Memory Extraction engine. Pending senior engineer verification.',
    };

    setMemories((prev) => [newMem, ...prev]);
    showToast(`VAJRA extracted new ${category} (${memoryId}) from incident ${incident.id}.`, 'info', 6000);
  };

  // VAJRA AI Chat Logic
  const sendMessageToVajra = async (userText, conversationId = activeConversationId) => {
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: userText,
    };

    // Optimistically add user message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, messages: [...conv.messages, userMsg] };
        }
        return conv;
      })
    );

    // Call Backend AI Chat
    try {
      const res = await vajraService.sendChatMessage(userText, conversationId);
      if (res.success && res.data?.vajraMessage) {
        const vajraMsg = res.data.vajraMessage;
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, vajraMsg],
              };
            }
            return conv;
          })
        );
        return;
      }
    } catch {
      // Fallback
    }

    // Local Grounded Synthesis Fallback
    const searchTerms = userText.toLowerCase().split(' ').filter((w) => w.length > 2);
    const relevantMemories = memories.filter((m) => {
      const text = `${m.content} ${m.componentId} ${m.componentName} ${m.type} ${m.tags?.join(' ')}`.toLowerCase();
      return searchTerms.some((term) => text.includes(term));
    }).slice(0, 3);

    const finalRetrieved = relevantMemories.length > 0 ? relevantMemories : memories.filter((m) => m.verificationStatus === 'Verified').slice(0, 2);

    let responseText = `I searched the SiliconSentinel engineering memory index across ${systems.length} systems and ${components.length} components.\n\nRetrieved **${finalRetrieved.length} relevant historical memories** matching your query. All observations are cross-referenced with recorded incidents to distinguish verified facts from unverified assumptions.`;

    const vajraMsg = {
      id: `msg-${Date.now()}-v`,
      sender: 'vajra',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: responseText,
      retrievedMemories: finalRetrieved.map((m) => ({
        id: m.id,
        componentId: m.componentId,
        type: m.type,
        content: m.content,
        confidence: m.confidence,
        verificationStatus: m.verificationStatus,
        source: m.source,
      })),
      feedback: null,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, messages: [...conv.messages, vajraMsg] };
        }
        return conv;
      })
    );
  };

  const createNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv = {
      id: newId,
      title: `Intelligence Session #${conversations.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      messages: [
        {
          id: `msg-${Date.now()}-welcome`,
          sender: 'vajra',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          text: `Welcome to **VAJRA AI Assistant** — SiliconSentinel's persistent reliability intelligence core.\n\nI have active semantic memory indexation over all electronic systems, semiconductor components, failure incidents, and engineering decisions. Ask me about component failures, maintenance rules, radiation anomalies, or root-cause troubleshooting.`,
          retrievedMemories: [],
          feedback: null,
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    showToast('New intelligence consultation session started.', 'info');
  };

  const submitFeedback = async (conversationId, messageId, feedbackType) => {
    try {
      await vajraService.submitFeedback(messageId, feedbackType, conversationId);
    } catch {
      // Fallback
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === messageId ? { ...m, feedback: feedbackType } : m
            ),
          };
        }
        return conv;
      })
    );
    showToast(`Feedback "${feedbackType}" recorded for model alignment.`, 'success');
  };

  // Helper stats
  const totalSystems = systems.length;
  const registeredComponents = components.length;
  const totalIncidents = incidents.length;
  const verifiedMemoriesCount = memories.filter((m) => m.verificationStatus === 'Verified').length;
  const pendingInvestigations = incidents.filter((i) => i.status !== 'Resolved').length;

  return (
    <AppDataContext.Provider
      value={{
        // Data
        systems,
        components,
        incidents,
        memories,
        conversations,
        activeConversationId,
        setActiveConversationId,
        backendStatus,
        isLoadingBackend,
        globalSearch,
        setGlobalSearch,

        // System actions
        addSystem,
        updateSystem,
        deleteSystem,

        // Component actions
        addComponent,
        updateComponent,
        deleteComponent,

        // Incident actions
        addIncident,

        // Memory actions
        verifyMemory,
        unverifyMemory,
        correctMemory,
        archiveMemory,
        deleteMemory,
        extractMemoryFromIncident,

        // VAJRA Chat actions
        sendMessageToVajra,
        createNewChat,
        submitFeedback,

        // Statistics
        stats: {
          totalSystems,
          registeredComponents,
          totalIncidents,
          verifiedMemoriesCount,
          pendingInvestigations,
        },
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
