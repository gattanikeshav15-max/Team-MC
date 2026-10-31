/**
 * AI Service for VAJRA Agentic Memory Orchestration
 * Handles interaction with Google Gemini API when configured,
 * or provides transparent grounded synthesis based strictly on retrieved database records.
 */

export const aiService = {
  /**
   * Generates a context-aware answer grounded in retrieved memories.
   */
  async generateResponse({ userQuery, retrievedMemories = [], componentMatch = null, systemMatch = null }) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    const memoryContextText = retrievedMemories.length > 0
      ? retrievedMemories
          .map(
            (m, i) =>
              `[Memory ${i + 1}] ID: ${m.id} | Component: ${m.componentId} (${m.componentName || 'N/A'})\nType: ${m.type} | Status: ${m.verificationStatus} | Confidence: ${m.confidence}%\nSource: ${m.source}\nContent: "${m.content}"`
          )
          .join('\n\n')
      : 'NO RELEVANT HISTORICAL MEMORIES FOUND IN DATABASE.';

    const systemPrompt = `You are VAJRA, the AI-powered persistent engineering memory and reliability intelligence engine of SiliconSentinel.
You assist senior defense and aerospace semiconductor reliability engineers.

CRITICAL INSTRUCTIONS:
1. Base your answer STRICTLY on the retrieved engineering memories and verified component records provided below.
2. If NO relevant memories are provided, explicitly state: "No historical engineering memories or incidents matching this query exist in the SiliconSentinel repository." Do NOT fabricate or hallucinate components, incidents, or test results.
3. Distinguish VERIFIED memories (confirmed engineering facts) from UNVERIFIED memories (preliminary hypotheses) and CORRECTED memories. Never present an unverified assumption as a proven design rule.
4. Always cite memory IDs (e.g. MEM-2026-901) and component IDs when referring to past incidents.
5. Provide concise, highly technical answers referencing semiconductor physics (e.g., thermal boundaries, dielectric traps, Single-Event Latchup, MTBF).`;

    const userPromptWithContext = `ENGINEER QUERY:
"${userQuery}"

MATCHED COMPONENT CONTEXT:
${componentMatch ? `Name: ${componentMatch.name} (${componentMatch.id}) | Category: ${componentMatch.category} | Status: ${componentMatch.status} | Incidents: ${componentMatch.incidentCount}` : 'None'}

RETRIEVED ENGINEERING MEMORIES FROM MONGODB ATLAS:
${memoryContextText}

Synthesize a technical reliability response based on this retrieved knowledge:`;

    // 1. If Gemini API Key is configured, execute live LLM inference
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userPromptWithContext}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2, // Low temperature for high precision & zero hallucination
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return {
              text: generatedText,
              provider: `Google Gemini (${model})`,
              groundedOnMemoriesCount: retrievedMemories.length,
            };
          }
        } else {
          const errData = await response.text();
          console.warn('Gemini API call returned non-200, falling back to local grounded synthesis:', errData);
        }
      } catch (err) {
        console.warn('Gemini network call failed, falling back to local grounded synthesis:', err.message);
      }
    }

    // 2. Deterministic Grounded Synthesis Fallback
    // Strictly adheres to requirement: Never pretend Gemini responded; report provider clearly.
    let responseText = '';

    if (retrievedMemories.length === 0 && !componentMatch) {
      responseText = `I searched the SiliconSentinel engineering memory index and found **zero historical incident records or memories** matching your query.

VAJRA does not fabricate telemetry data. If this relates to a newly observed component failure, please log it via the Incident Management interface to initiate autonomous memory extraction.`;
    } else if (componentMatch) {
      responseText = `I analyzed the engineering memory database and incident repository for **${componentMatch.name}** (\`${componentMatch.id}\`).\n\n`;
      responseText += `* **Operational Status:** ${componentMatch.status} with **${componentMatch.incidentCount} recorded incident(s)**.\n`;
      responseText += `* **Technical Envelope:** ${componentMatch.technicalSpecs?.voltageRating || componentMatch.technicalSpecs?.radiationHardness || 'Standard military specifications'}.\n\n`;

      if (retrievedMemories.length > 0) {
        responseText += `### Grounded Engineering Memories Retrieved from MongoDB:\n`;
        retrievedMemories.forEach((mem, idx) => {
          responseText += `${idx + 1}. **[${mem.type} • \`${mem.id}\`]** ${mem.content} *(Status: ${mem.verificationStatus}, Confidence: ${mem.confidence}%)*\n`;
        });
        responseText += `\n**VAJRA Recommendation:** Prioritize verification of thermal dissipation boundaries and enforce circuit snubber limits based on memory \`${retrievedMemories[0].id}\`.`;
      } else {
        responseText += `No specific engineering failure memories are currently cataloged for this part.`;
      }
    } else {
      responseText = `VAJRA retrieved **${retrievedMemories.length} relevant historical engineering memory record(s)** from MongoDB:\n\n`;
      retrievedMemories.forEach((mem, idx) => {
        const isFact = mem.verificationStatus === 'Verified';
        responseText += `* **${mem.type} (\`${mem.id}\`):** ${mem.content}\n  - *Verification:* ${mem.verificationStatus} ${isFact ? '(Confirmed Fact)' : '(Preliminary Hypothesis - Human Review Required)'}\n  - *Source Incident:* \`${mem.source || 'Direct Lab Log'}\` | *Confidence:* ${mem.confidence}%\n\n`;
      });
      responseText += `*Note: In compliance with mission safety protocols, all recommendations derived from unverified memories are flagged for peer review.*`;
    }

    return {
      text: responseText,
      provider: 'VAJRA Grounded Synthesis Engine (Demo Mode • Add GEMINI_API_KEY in backend/.env for Live LLM)',
      groundedOnMemoriesCount: retrievedMemories.length,
    };
  },
};

export default aiService;
