export const initialConversations = [
  {
    id: "conv-001",
    title: "GaN Transistor Thermal Runaway & Leakage",
    timestamp: "2026-10-31 09:40:12",
    messages: [
      {
        id: "msg-001",
        sender: "user",
        timestamp: "2026-10-31 09:40:12",
        text: "What problems have occurred with the EPC2050 GaN transistor under thermal cycling?"
      },
      {
        id: "msg-002",
        sender: "vajra",
        timestamp: "2026-10-31 09:40:16",
        text: "Based on historical telemetry records and verified engineering memories in SiliconSentinel, the EPC2050 GaN Power Transistor (`CMP-GAN-4401`) has exhibited critical vulnerabilities during rapid orbital thermal transitions (specifically solar eclipse to daylight emergence):\n\n1. **Negative Gate Ringing & Trap Accumulation:** When inductive switching transients drive negative gate voltage below -4.5V for longer than 15ns, electron traps accumulate in the GaN 2DEG dielectric, causing Gate-Source leakage current (Igss) to jump up to 420x normal nominal levels.\n2. **Thermal Interface Material Pump-Out:** Standard silicone thermal greases degrade rapidly in vacuum under high thermal amplitude cycles. Pre-formed 0.1mm pure Indium foil under 15 psi uniform torque is required to prevent hotspot runaway.\n3. **Recommended Immediate Action:** Enforce active gate snubber damping and apply a 65% power derating limit until the gate drive circuitry is recalibrated.",
        retrievedMemories: [
          {
            id: "MEM-2026-901",
            componentId: "CMP-GAN-4401",
            type: "Failure Memory",
            content: "GaN 2DEG channel degradation observed when negative gate drive ringing dips below -4.5V for > 15ns during high dV/dt inductive switching transients, triggering gate dielectric trap accumulation and elevated Igss leakage.",
            confidence: 94,
            verificationStatus: "Verified",
            source: "INC-2026-089"
          },
          {
            id: "MEM-2026-790",
            componentId: "CMP-GAN-4401",
            type: "Maintenance Memory",
            content: "Thermal interface material for EPC2050 passivated dies must utilize pre-formed pure Indium foil (0.1mm thickness) with 15 psi uniform clamping pressure; standard silicon thermal pastes experience pump-out degradation under thermal cycling in vacuum.",
            confidence: 99,
            verificationStatus: "Verified",
            source: "SAT-PCDU Space Assembly SOP Rev 3"
          }
        ],
        feedback: null
      }
    ]
  },
  {
    id: "conv-002",
    title: "Virtex UltraScale+ SEL Mitigation",
    timestamp: "2026-10-30 14:15:30",
    messages: [
      {
        id: "msg-003",
        sender: "user",
        timestamp: "2026-10-30 14:15:30",
        text: "Find similar historical failures for FPGA single-event latchups and what was decided."
      },
      {
        id: "msg-004",
        sender: "vajra",
        timestamp: "2026-10-30 14:15:34",
        text: "I retrieved 2 engineering memories and 1 primary incident regarding radiation-induced latchup in AMD Xilinx Virtex UltraScale+ (`CMP-FPG-1002`) on the Phased-Array Radar Controller:\n\n* **Incident INC-2026-074:** A high-energy proton collision caused an instantaneous current jump on the 0.95V VCCINT core rail from 8.2A to 19.4A. Destructive breakdown was prevented because the fast solid-state electronic crowbar tripped within 4.2ms.\n* **Board Decision:** Scrub engine interval was reduced by 10x (from 500ms down to 50ms) to clear single-event upsets before they cluster into latchup pathways.\n* **Caution (Unverified Assumption):** Note that an unverified hypothesis (`MEM-2026-750`) suggests possible micro-damage in DSP tile 3 clock buffers lowering Qcrit. This is **not yet verified** and should not be used as an established design rule until accelerator tests conclude.",
        retrievedMemories: [
          {
            id: "MEM-2026-884",
            componentId: "CMP-FPG-1002",
            type: "Decision Memory",
            content: "Engineering Board approved immediate reduction of autonomous SEU scrub interval from 500ms to 50ms and enforced hardware crowbar trip threshold at 14.5A on VCCINT 0.95V rail to prevent permanent destructive latchup.",
            confidence: 98,
            verificationStatus: "Verified",
            source: "INC-2026-074"
          },
          {
            id: "MEM-2026-750",
            componentId: "CMP-FPG-1002",
            type: "Failure Memory",
            content: "Hypothesis: DSP tile 3 clock tree buffer may have sustained heavy-ion micro-damage lowering the critical charge (Qcrit) necessary to trigger single-event functional interrupts under multi-GHz vector matrix operations.",
            confidence: 62,
            verificationStatus: "Unverified",
            source: "Rad-Hard Test Log - Beam Run 14"
          }
        ],
        feedback: "helpful"
      }
    ]
  }
];
