import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSystems } from '../data/mockSystems';
import { initialComponents } from '../data/mockComponents';
import { initialIncidents } from '../data/mockIncidents';
import { initialMemories } from '../data/mockMemories';
import { initialConversations } from '../data/mockVajraChats';
import { useToast } from './ToastContext';

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

  // Global search query
  const [globalSearch, setGlobalSearch] = useState('');

  // Save to localStorage whenever state changes
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
  const addSystem = (newSystem) => {
    const system = {
      ...newSystem,
      id: newSystem.id || `SYS-${Date.now().toString(36).toUpperCase()}`,
      componentCount: Number(newSystem.componentCount) || 0,
      registrationDate: newSystem.registrationDate || new Date().toISOString().split('T')[0],
      status: newSystem.status || 'Nominal',
      reliabilityScore: Number(newSystem.reliabilityScore) || 98.0,
    };
    setSystems((prev) => [system, ...prev]);
    showToast(`System "${system.name}" registered successfully.`, 'success');
    return system;
  };

  const updateSystem = (id, updatedFields) => {
    setSystems((prev) =>
      prev.map((sys) => (sys.id === id ? { ...sys, ...updatedFields } : sys))
    );
    showToast(`System ${id} updated successfully.`, 'success');
  };

  const deleteSystem = (id) => {
    setSystems((prev) => prev.filter((sys) => sys.id !== id));
    showToast(`System ${id} deleted from registry.`, 'warning');
  };

  // Component CRUD Operations
  const addComponent = (newComponent) => {
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
    setComponents((prev) => [comp, ...prev]);
    // increment componentCount in system
    if (system) {
      updateSystem(system.id, { componentCount: (system.componentCount || 0) + 1 });
    }
    showToast(`Component "${comp.name}" added to registry.`, 'success');
    return comp;
  };

  const updateComponent = (id, updatedFields) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    showToast(`Component ${id} specifications updated.`, 'success');
  };

  const deleteComponent = (id) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    showToast(`Component ${id} removed.`, 'warning');
  };

  // Incident CRUD Operations & VAJRA Auto-Memory Generation
  const addIncident = (incidentData, autoExtract = true) => {
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

    setIncidents((prev) => [newInc, ...prev]);

    // update component incident count & degradation status if High/Critical
    if (component) {
      const newStatus = incidentData.severity === 'Critical' ? 'Critical' : incidentData.severity === 'High' ? 'Degraded' : component.status;
      updateComponent(component.id, {
        incidentCount: (component.incidentCount || 0) + 1,
        status: newStatus,
      });
    }

    showToast(`Incident ${incidentId} logged successfully.`, 'success');

    // Automatically trigger VAJRA Agentic Memory extraction if enabled
    if (autoExtract) {
      setTimeout(() => {
        extractMemoryFromIncident(newInc);
      }, 1200);
    }

    return newInc;
  };

  // Memory Actions (Verify, Unverify, Correct, Archive, Delete, Extract)
  const verifyMemory = (id, engineerName = 'Keshav Gattani') => {
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

  const unverifyMemory = (id) => {
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

  const correctMemory = (id, updatedContent, engineerName = 'Keshav Gattani') => {
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
    showToast(`Memory ${id} successfully corrected and logged in audit trail.`, 'success');
  };

  const archiveMemory = (id) => {
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

  const deleteMemory = (id) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast(`Memory ${id} purged from persistent store.`, 'warning');
  };

  const extractMemoryFromIncident = (incident) => {
    const memoryId = `MEM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const category = incident.severity === 'Critical' ? 'Failure Memory' : 'Observation Memory';
    const confidence = incident.severity === 'Critical' ? 95 : 82;

    const newMem = {
      id: memoryId,
      componentId: incident.componentId,
      componentName: incident.componentName,
      type: category,
      category: category,
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

  // VAJRA AI Chat Logic (Simulated Vector Retrieval & Agentic Synthesis)
  const sendMessageToVajra = async (userText, conversationId = activeConversationId) => {
    // 1. Add user message
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      text: userText,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMsg],
          };
        }
        return conv;
      })
    );

    // 2. Perform intelligent retrieval from local memories & components
    const searchTerms = userText.toLowerCase().split(' ').filter((w) => w.length > 2);
    
    // Find matching memories by keywords or component
    const relevantMemories = memories.filter((m) => {
      const text = `${m.content} ${m.componentId} ${m.componentName} ${m.type} ${m.tags?.join(' ')}`.toLowerCase();
      return searchTerms.some((term) => text.includes(term));
    }).slice(0, 3);

    // If no direct keyword match, pick top verified memories to show grounded context
    const finalRetrieved = relevantMemories.length > 0 ? relevantMemories : memories.filter((m) => m.verificationStatus === 'Verified').slice(0, 2);

    // Generate intelligent engineering synthesis response
    let responseText = '';
    const componentMatch = components.find((c) =>
      userText.toLowerCase().includes(c.id.toLowerCase()) ||
      userText.toLowerCase().includes(c.name.toLowerCase()) ||
      userText.toLowerCase().includes(c.category.toLowerCase())
    );

    if (componentMatch) {
      responseText = `I analyzed the engineering memory database and incident repository for **${componentMatch.name}** (\`${componentMatch.id}\`).\n\n`;
      responseText += `* **Operational Status:** ${componentMatch.status} with **${componentMatch.incidentCount} recorded incident(s)**.\n`;
      responseText += `* **Technical Envelope:** Rated for ${componentMatch.technicalSpecs?.voltageRating || componentMatch.technicalSpecs?.radiationHardness || 'Standard military specifications'}.\n\n`;
      if (finalRetrieved.length > 0) {
        responseText += `### Key Engineering Memories Retrieved:\n`;
        finalRetrieved.forEach((mem, idx) => {
          responseText += `${idx + 1}. **[${mem.type}]** ${mem.content} *(Status: ${mem.verificationStatus}, Confidence: ${mem.confidence}%)*\n`;
        });
      }
      responseText += `\n**VAJRA Recommendation:** Prioritize inspection of thermal boundary interfaces and verify latchup protection circuits prior to subsequent high-altitude/radiation cycles.`;
    } else if (userText.toLowerCase().includes('latchup') || userText.toLowerCase().includes('fpga') || userText.toLowerCase().includes('sel')) {
      responseText = `VAJRA retrieved historical Single-Event Latchup (SEL) anomalies from the memory graph:\n\n* High-energy radiation environments trigger rapid current escalation on core rails (e.g., 0.95V VCCINT on \`CMP-FPG-1002\`).\n* Fast hardware crowbar tripping within < 5ms is essential to prevent thermal silicon junction destruction.\n* **Design Rule:** Ensure autonomous scrub cycle frequency is tuned to 50ms in high-altitude or LEO orbital planes.`;
    } else if (userText.toLowerCase().includes('gan') || userText.toLowerCase().includes('thermal') || userText.toLowerCase().includes('leakage')) {
      responseText = `Retrieving failure and maintenance memories for Wide Bandgap GaN Power devices:\n\n1. **Dielectric Traps:** Gate-source transient ringing below -4.5V drives negative electron trapping, raising standby drain leakage significantly.\n2. **Thermal Vacuum Solution:** Avoid standard thermal grease pump-out by deploying pure 0.1mm Indium preforms under 15 psi torqued clamping.\n3. Continuous telemetry monitoring of Vds ringing amplitude is strongly advised.`;
    } else {
      responseText = `I have searched SiliconSentinel's persistent engineering memory store across ${systems.length} systems and ${components.length} components.\n\n`;
      responseText += `Retrieved **${finalRetrieved.length} relevant engineering memories** matching your query. All observations have been cross-referenced with recorded incidents to distinguish verified facts from unverified assumptions.`;
    }

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
          return {
            ...conv,
            messages: [...conv.messages, vajraMsg],
          };
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

  const submitFeedback = (conversationId, messageId, feedbackType) => {
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
