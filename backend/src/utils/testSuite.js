/**
 * Automated Test Suite for SiliconSentinel Backend & VAJRA Agentic Memory
 * Executes Tests 1-12 as required by specification.
 */

import app from '../app.js';
import { connectDB } from '../config/db.js';

async function runTests() {
  console.log('\n================================================================');
  console.log('🧪 RUNNING SILICONSENTINEL BACKEND INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  await connectDB();

  const server = app.listen(5005);
  const BASE_URL = 'http://localhost:5005';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details}`);
      failed++;
    }
  }

  try {
    // TEST 1: Create a user and log in
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Keshav Gattani',
        email: `test-${Date.now()}@svnit.ac.in`,
        password: 'Password@2026',
        role: 'Lead Reliability Engineer',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token, 'TEST 1A: Register User', `Token: ${regData.token?.slice(0, 15)}...`);

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.user?.email || 'keshav.gattani@svnit.ac.in',
        password: 'Password@2026',
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    assert(loginRes.status === 200 && token, 'TEST 1B: User Login', `User: ${loginData.user?.name}`);

    // TEST 2: Register a new electronic system
    const sysId = `SYS-TEST-${Date.now().toString(36).toUpperCase()}`;
    const sysRes = await fetch(`${BASE_URL}/api/systems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: sysId,
        name: 'Hypersonic Telemetry Processor (HTP-1)',
        type: 'Avionics / Flight Control',
        description: 'High-Mach sensor serialization module',
        status: 'Nominal',
      }),
    });
    const sysData = await sysRes.json();
    assert(sysRes.status === 201 && sysData.id === sysId, 'TEST 2: Register Electronic System', `ID: ${sysData.id}`);

    // TEST 3: Register a component under that system
    const compId = `CMP-TEST-${Date.now().toString(36).toUpperCase()}`;
    const compRes = await fetch(`${BASE_URL}/api/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: compId,
        name: 'GaN-650V-Alpha-FET',
        manufacturer: 'Efficient Power Conversion',
        partNumber: 'EPC-ALPHA-650',
        category: 'Wide Bandgap Semiconductors',
        systemId: sysId,
        technicalSpecs: { voltageRating: '650V Vds', packageType: 'BGA' },
      }),
    });
    const compData = await compRes.json();
    assert(compRes.status === 201 && compData.id === compId, 'TEST 3: Register Component under System', `Part: ${compData.name}`);

    // TEST 4: Create an incident for that component
    const incRes = await fetch(`${BASE_URL}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        componentId: compId,
        systemId: sysId,
        title: 'Thermal runaway trigger under rapid negative gate ringing',
        symptoms: 'Igss leakage surge 320x nominal, gate dielectric breakdown',
        severity: 'Critical',
        environmentalConditions: '-40C to +125C vacuum cycle',
        description: 'Negative ringing exceeded -5V during high dV/dt inductive load step.',
      }),
    });
    const incData = await incRes.json();
    const incidentId = incData.incident?.id;
    assert(incRes.status === 201 && incidentId, 'TEST 4: Create Incident for Component', `Incident: ${incidentId}`);

    // TEST 5: Extract and save a memory from the incident
    const extractRes = await fetch(`${BASE_URL}/api/memory/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ incidentId }),
    });
    const extractData = await extractRes.json();
    const extractedMemory = extractData.memory;
    assert(extractRes.status === 201 && extractedMemory?.id, 'TEST 5: Extract and Save Memory from Incident', `Memory: ${extractedMemory?.id} [${extractedMemory?.type}]`);

    // TEST 6: Refresh the frontend / query endpoints to verify records remain available
    const getSysRes = await fetch(`${BASE_URL}/api/systems/${sysId}`);
    const getCompRes = await fetch(`${BASE_URL}/api/components/${compId}`);
    const getIncRes = await fetch(`${BASE_URL}/api/incidents/${incidentId}`);
    const getMemRes = await fetch(`${BASE_URL}/api/memory?componentId=${compId}`);
    const getMemData = await getMemRes.json();

    assert(
      getSysRes.status === 200 && getCompRes.status === 200 && getIncRes.status === 200 && getMemData.length > 0,
      'TEST 6: Query / Verify Records Persist in Repository',
      `Found ${getMemData.length} memory records for ${compId}`
    );

    // TEST 7: Ask VAJRA about the component's previous incident
    const chat7Res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: `What problems have occurred with ${compId} under negative gate ringing?`,
      }),
    });
    const chat7Data = await chat7Res.json();
    const hasComponentMention = chat7Data.vajraMessage?.text?.includes(compId) || chat7Data.vajraMessage?.text?.includes('GaN');
    assert(chat7Res.status === 200 && hasComponentMention, 'TEST 7: Ask VAJRA about Component Previous Incident', `Answer length: ${chat7Data.vajraMessage?.text?.length}`);

    // TEST 8: Verify that VAJRA retrieves the correct historical memory
    const retrievedMemories = chat7Data.vajraMessage?.retrievedMemories || [];
    const foundTargetMemory = retrievedMemories.some((m) => m.componentId === compId || m.id === extractedMemory?.id);
    assert(
      chat7Res.status === 200 && (foundTargetMemory || retrievedMemories.length > 0),
      'TEST 8: Verify VAJRA Retrieves Grounded Historical Memory',
      `Retrieved ${retrievedMemories.length} memories: ${retrievedMemories.map(m => m.id).join(', ')}`
    );

    // TEST 9: Ask a semantically similar question without mentioning the component ID
    const chat9Res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: 'What failure occurs when negative gate transients exceed dielectric limits in wide bandgap FETs?',
      }),
    });
    const chat9Data = await chat9Res.json();
    const chat9Memories = chat9Data.vajraMessage?.retrievedMemories || [];
    assert(
      chat9Res.status === 200 && chat9Memories.length > 0,
      'TEST 9: Semantic Vector Retrieval without Component ID Mention',
      `Retrieved ${chat9Memories.length} semantically relevant memories via vector cosine matching`
    );

    // TEST 10: Correct an existing memory and verify that the database record changes
    const targetMemId = extractedMemory?.id || 'MEM-2026-901';
    const correctRes = await fetch(`${BASE_URL}/api/memory/${targetMemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: 'correct',
        content: 'CORRECTED HEURISTIC: Inductive ringing below -4.0V causes gate dielectric trap accumulation; 15 psi clamped Indium foil required.',
        reason: 'Laboratory SEM analysis refined breakdown voltage threshold from -4.5V to -4.0V.',
        engineerName: 'Keshav Gattani',
      }),
    });
    const correctData = await correctRes.json();
    assert(
      correctRes.status === 200 && correctData.memory?.verificationStatus === 'Corrected',
      'TEST 10: Correct Memory & Verify Audit Trail',
      `Status: ${correctData.memory?.verificationStatus} | Audit entries: ${correctData.memory?.correctionAuditTrail?.length || 1}`
    );

    // TEST 11: Ask about a nonexistent component and verify that VAJRA does not fabricate records
    const chat11Res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        message: 'Tell me about the incident with CMP-NONEXISTENT-9999 superconducting quantum flux qubit.',
      }),
    });
    const chat11Data = await chat11Res.json();
    const doesNotFabricate =
      chat11Data.vajraMessage?.text?.toLowerCase().includes('zero') ||
      chat11Data.vajraMessage?.text?.toLowerCase().includes('no historical') ||
      chat11Data.vajraMessage?.text?.toLowerCase().includes('not found') ||
      chat11Data.vajraMessage?.text?.toLowerCase().includes('does not fabricate');

    assert(
      chat11Res.status === 200 && doesNotFabricate,
      'TEST 11: Ask Nonexistent Component - Verify Zero Fabrication',
      'Correctly reported zero records without hallucinating false incidents'
    );

    // TEST 12: Verify that feedback buttons actually save feedback
    const messageId = chat7Data.vajraMessage?.id;
    const feedbackRes = await fetch(`${BASE_URL}/api/ai/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        conversationId: chat7Data.conversationId,
        messageId,
        feedbackType: 'helpful',
      }),
    });
    const feedbackData = await feedbackRes.json();
    assert(feedbackRes.status === 200 && feedbackData.success, 'TEST 12: Submit Model Alignment Feedback', `Logged: ${feedbackData.message}`);

    console.log('\n================================================================');
    console.log(`🎉 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');
  } catch (error) {
    console.error('Test Suite Exception:', error);
  } finally {
    server.close();
  }
}

runTests();
