import embeddingService from '../services/embeddingService.js';

export const initialSystems = [
  {
    id: "SYS-AERO-01",
    name: "Avionics Mission Computer (AMC-V)",
    type: "Avionics / Flight Control",
    description: "Triple-redundant embedded flight computer for UAV high-altitude telemetry and flight control envelope management.",
    componentCount: 14,
    registrationDate: "2026-01-15",
    status: "Nominal",
    reliabilityScore: 98.4,
    location: "Flight Avionics Bay - Section 2",
    leadEngineer: "Dr. Elena Rostova",
    environment: "Stratospheric Low Pressure (-55°C to +85°C)"
  },
  {
    id: "SYS-RAD-04",
    name: "Phased-Array Radar Controller (PARC-9)",
    type: "Radar & Signal Processing",
    description: "Active electronically scanned array (AESA) digital beamformer and high-throughput RF synthesis hub.",
    componentCount: 22,
    registrationDate: "2026-02-04",
    status: "Degraded",
    reliabilityScore: 89.2,
    location: "Nose Radome Electronics Rack",
    leadEngineer: "Marcus Vance",
    environment: "Dynamic RF EMI, Conductive Liquid Cooling"
  },
  {
    id: "SYS-SAT-02",
    name: "LEO Cubesat Power System (PCDU-Alpha)",
    type: "Power Conditioning & Distribution",
    description: "Rad-hard GaN-based power conditioning and distribution unit for sun-synchronous orbit satellite constellations.",
    componentCount: 18,
    registrationDate: "2026-02-18",
    status: "Nominal",
    reliabilityScore: 96.7,
    location: "Bus Core Compartment 1",
    leadEngineer: "Keshav Gattani",
    environment: "Vacuum, Solar Radiation (TID > 50 krad)"
  },
  {
    id: "SYS-DRV-11",
    name: "Autonomous Vehicle LiDAR Hub (AV-LIN-3)",
    type: "Perception & Edge Computing",
    description: "Real-time FMCW LiDAR point-cloud pre-processing and sensor synchronization edge gateway.",
    componentCount: 9,
    registrationDate: "2026-03-12",
    status: "Under Maintenance",
    reliabilityScore: 84.1,
    location: "Vehicle Roof Sensor Pod A",
    leadEngineer: "Aanya Patel",
    environment: "Automotive ISO 26262 ASIL-D, High Vibration"
  },
  {
    id: "SYS-CRYO-07",
    name: "Cryogenic Sensor Front-End (CSFE-Mk2)",
    type: "Deep Cryo Sensing",
    description: "Ultra-low-noise quantum sensor readout interface operating inside cold-finger vacuum cryostats.",
    componentCount: 11,
    registrationDate: "2026-04-01",
    status: "Nominal",
    reliabilityScore: 99.1,
    location: "Cryogenic Laboratory Bay 3",
    leadEngineer: "Dr. Chen Wei",
    environment: "4 Kelvin Cryo Vacuum (< 10^-6 Torr)"
  }
];

export const initialComponents = [
  {
    id: "CMP-GAN-4401",
    name: "EPC2050 GaN Power Transistor",
    manufacturer: "Efficient Power Conversion (EPC)",
    partNumber: "EPC2050-ENH-350V",
    category: "Wide Bandgap Semiconductors",
    systemId: "SYS-SAT-02",
    systemName: "LEO Cubesat Power System (PCDU-Alpha)",
    status: "Degraded",
    incidentCount: 3,
    mtbfHours: 450000,
    technicalSpecs: {
      voltageRating: "350V Vds",
      continuousCurrent: "30A",
      onResistance: "65 mOhm (at 25°C)",
      packageType: "Passivated Die BGA",
      dielectric: "Gallium Nitride (GaN-on-Si)",
      tempRange: "-40°C to +150°C"
    },
    description: "High-efficiency enhancement-mode GaN FET used in synchronous buck converter stages.",
    maintenanceHistory: [
      { date: "2026-03-10", action: "Thermal interface material re-application with Indium foil", technician: "K. Gattani", outcome: "Pass" },
      { date: "2026-05-22", action: "Gate drive ringing snubber circuit recalibration", technician: "E. Rostova", outcome: "Pass" }
    ]
  },
  {
    id: "CMP-MCU-8920",
    name: "SAMV71Q21RT Rad-Hard Microcontroller",
    manufacturer: "Microchip Aerospace",
    partNumber: "SAMV71Q21RT-DHB-MQ",
    category: "Microcontrollers & SoCs",
    systemId: "SYS-AERO-01",
    systemName: "Avionics Mission Computer (AMC-V)",
    status: "Nominal",
    incidentCount: 1,
    mtbfHours: 890000,
    technicalSpecs: {
      core: "ARM Cortex-M7 with FPU @ 300MHz",
      flashMemory: "2048 KB ECC Protected",
      sram: "384 KB System SRAM + TCM",
      radiationHardness: "TID up to 100 krad(Si), SEL immune > 60 MeV",
      packageType: "144-pin Ceramic QFP",
      tempRange: "-55°C to +125°C"
    },
    description: "Radiation-tolerant supervisory mission microcontroller executing attitude determination and fault containment.",
    maintenanceHistory: [
      { date: "2026-02-14", action: "Bootloader ROM parity check and flash ECC integrity test", technician: "M. Vance", outcome: "Pass" }
    ]
  },
  {
    id: "CMP-FPG-1002",
    name: "Virtex UltraScale+ Space-Grade XQRKU060",
    manufacturer: "AMD Xilinx Defense & Aerospace",
    partNumber: "XQRKU060-1CNA1509E",
    category: "FPGAs & Accelerators",
    systemId: "SYS-RAD-04",
    systemName: "Phased-Array Radar Controller (PARC-9)",
    status: "Warning",
    incidentCount: 4,
    mtbfHours: 320000,
    technicalSpecs: {
      logicCells: "725,550",
      dspSlices: "2,760 DSP48E2",
      packageType: "Ceramic Column Grid Array (CFGA1509)",
      voltageRating: "0.95V VCCINT",
      tempRange: "-55°C to +125°C"
    },
    description: "Massive digital signal processing FPGA driving true-time-delay coefficients for phased antenna elements.",
    maintenanceHistory: [
      { date: "2026-04-18", action: "Replaced switching regulator decoupling capacitor bank", technician: "A. Patel", outcome: "Pass" },
      { date: "2026-07-02", action: "SEU soft error scrub engine firmware revision uploaded", technician: "K. Gattani", outcome: "Pass" }
    ]
  },
  {
    id: "CMP-ADC-3312",
    name: "AD9680 Dual 14-Bit 1.0 GSPS ADC",
    manufacturer: "Analog Devices Inc.",
    partNumber: "AD9680BBPZ-1000",
    category: "RF & Mixed Signal",
    systemId: "SYS-CRYO-07",
    systemName: "Cryogenic Sensor Front-End (CSFE-Mk2)",
    status: "Nominal",
    incidentCount: 0,
    mtbfHours: 1200000,
    technicalSpecs: {
      voltageRating: "1.25V / 2.5V",
      packageType: "64-lead LFCSP",
      tempRange: "-40°C to +85°C"
    },
    description: "High-speed direct RF sampling analog-to-digital converter operating in low-noise sensor arrays.",
    maintenanceHistory: [
      { date: "2026-04-10", action: "JESD204B link eye-diagram margin testing under cryo vacuum", technician: "Dr. Chen Wei", outcome: "Pass" }
    ]
  },
  {
    id: "CMP-PMIC-5509",
    name: "TPS7H4001-SP Space Buck Converter",
    manufacturer: "Texas Instruments",
    partNumber: "TPS7H4001QPWPRSP",
    category: "Power Management ICs",
    systemId: "SYS-AERO-01",
    systemName: "Avionics Mission Computer (AMC-V)",
    status: "Nominal",
    incidentCount: 2,
    mtbfHours: 710000,
    technicalSpecs: {
      voltageRating: "3V to 7V input, 0.95V output",
      continuousCurrent: "18A Synchronous Step-Down",
      radiationHardness: "TID 100 krad(Si), SEE immune to LET = 75",
      packageType: "TSSOP-28"
    },
    description: "Point-of-Load buck converter supplying low-noise 0.95V core voltage rails to mission-critical processors.",
    maintenanceHistory: [
      { date: "2026-03-02", action: "Output filter choke saturation test under full step load", technician: "E. Rostova", outcome: "Pass" }
    ]
  },
  {
    id: "CMP-LDR-6621",
    name: "LMC6082 Precision Dual CMOS Op-Amp",
    manufacturer: "Texas Instruments",
    partNumber: "LMC6082AIMX/NOPB",
    category: "Precision Analog",
    systemId: "SYS-DRV-11",
    systemName: "Autonomous Vehicle LiDAR Hub (AV-LIN-3)",
    status: "Critical",
    incidentCount: 3,
    mtbfHours: 290000,
    technicalSpecs: {
      voltageRating: "4.5V to 15.5V Rail-to-Rail",
      packageType: "SOIC-8 Industrial Grade",
      tempRange: "-40°C to +85°C"
    },
    description: "Ultra-low input bias current amplifier used for photodiode transimpedance amplification in LiDAR receiver circuits.",
    maintenanceHistory: [
      { date: "2026-06-11", action: "Conformal coating inspection and humidity ingress dry-bake", technician: "A. Patel", outcome: "Pass" }
    ]
  }
];

export const initialIncidents = [
  {
    id: "INC-2026-089",
    componentId: "CMP-GAN-4401",
    componentName: "EPC2050 GaN Power Transistor",
    systemId: "SYS-SAT-02",
    title: "Gate-source leakage current surge during pulsed high-altitude firing",
    description: "During orbital thermal cycle transition from eclipse to sunlit phase, Gate-Source leakage (Igss) jumped by 420x, inducing an unexpected 18% thermal spike on the primary bus buck converter PCB copper plane.",
    symptoms: "Elevated standby drain current, switching node overshoot voltage +42V above Vds max rating, telemetry flag: DC_BUS_EFFICIENCY_DEGRADED.",
    severity: "High",
    status: "Under Investigation",
    reportedDate: "2026-10-24 14:32:00",
    environmentalConditions: "Orbital solar radiation transition, -32°C ambient cold vacuum, heavy ion solar flare detected.",
    notes: "Requires VAJRA cross-check against 2025 GaN gate dielectric trap degradation experiments.",
    outcome: "Pending engineering board analysis. Pre-emptive power derating to 65% recommended by VAJRA.",
    assignedEngineer: "Keshav Gattani"
  },
  {
    id: "INC-2026-074",
    componentId: "CMP-FPG-1002",
    componentName: "Virtex UltraScale+ Space-Grade XQRKU060",
    systemId: "SYS-RAD-04",
    title: "Single-Event Latchup (SEL) signature on High-Speed DSP tile 3",
    description: "High-energy proton beam interaction triggered sudden supply current jump on the 0.95V VCCINT line from 8.2A to 19.4A, tripping the automated solid-state overcurrent circuit breaker in 4.2ms.",
    symptoms: "Immediate DSP beamforming sync loss, automated power rail crowbar tripped, FPGA reboot into fallback golden bitstream.",
    severity: "Critical",
    status: "Resolved",
    reportedDate: "2026-10-12 09:15:00",
    environmentalConditions: "High altitude radiation environment, 85°C FPGA die hotspot.",
    notes: "Overcurrent trip saved the silicon from permanent destructive latchup. Re-programmed scrub cycle interval to 50ms.",
    outcome: "Verified and fixed via hardware crowbar latchup reset sequence; memory logged for future mission flight computer profiles.",
    assignedEngineer: "Dr. Elena Rostova"
  },
  {
    id: "INC-2026-062",
    componentId: "CMP-PMIC-5509",
    componentName: "TPS7H4001-SP Space Buck Converter",
    systemId: "SYS-AERO-01",
    title: "Transient VDD overshoot (+380mV) during cold-boot sequence below -40°C",
    description: "During cryogenic chamber start-up verification test, soft-start capacitor dielectric absorption altered RC charging slope, producing a 380mV transient overshoot on the MCU 0.95V core supply rail.",
    symptoms: "Supervisory reset IC held MCU in reset loop for 1400ms before stable PLL lock achieved.",
    severity: "Medium",
    status: "Resolved",
    reportedDate: "2026-09-28 17:45:00",
    environmentalConditions: "-45°C ambient temperature chamber, dry nitrogen purge atmosphere.",
    notes: "Soft-start ceramic capacitor swapped for temperature-stable COG/NPO dielectric.",
    outcome: "Corrected capacitor BOM part number and re-qualified cold start envelope across 50 cycles.",
    assignedEngineer: "Marcus Vance"
  },
  {
    id: "INC-2026-051",
    componentId: "CMP-MCU-8920",
    componentName: "SAMV71Q21RT Rad-Hard Microcontroller",
    systemId: "SYS-AERO-01",
    title: "Clock jitter degradation at junction temp > 105°C affecting QSPI timing",
    description: "Extended hypersonic simulation test pushed MCU ambient boundary layer to 110°C, causing external ceramic oscillator phase noise to exceed the setup time margin of high-speed QSPI flash reads.",
    symptoms: "Intermittent checksum failures on telemetry data flash sector reads during high-temperature cruise.",
    severity: "Medium",
    status: "Investigated",
    reportedDate: "2026-08-19 11:05:00",
    environmentalConditions: "+108°C junction temperature, 20G random acoustic vibration.",
    notes: "Added 1 additional wait state to QSPI bus controller register when MCU internal temperature sensor exceeds 95°C.",
    outcome: "Firmware dynamic wait-state governor validated across 20 thermal ramp cycles.",
    assignedEngineer: "Aanya Patel"
  },
  {
    id: "INC-2026-042",
    componentId: "CMP-LDR-6621",
    componentName: "LMC6082 Precision Dual CMOS Op-Amp",
    systemId: "SYS-DRV-11",
    title: "Input offset voltage drift exceeding 15uV/°C under prolonged moisture exposure",
    description: "Field vehicle test in coastal monsoon sector revealed LiDAR return signal baseline offset shift of 280uV, causing false obstacle detection at distances > 120m.",
    symptoms: "LiDAR phantom echo points recorded in point-cloud cluster algorithm.",
    severity: "High",
    status: "Action Required",
    reportedDate: "2026-07-30 08:20:00",
    environmentalConditions: "95% Relative Humidity, 40°C ambient, saltwater aerosol environment.",
    notes: "PCB guard ring solder mask had microscopic pinhole voids allowing surface leakage currents into the ultra-high impedance inverting node.",
    outcome: "Mandated dual-coat parylene vacuum deposition on all sensor pod analog boards.",
    assignedEngineer: "Keshav Gattani"
  }
];

export const initialMemories = [
  {
    id: "MEM-2026-901",
    componentId: "CMP-GAN-4401",
    componentName: "EPC2050 GaN Power Transistor",
    systemId: "SYS-SAT-02",
    type: "Failure Memory",
    category: "Failure Memory",
    content: "GaN 2DEG channel degradation observed when negative gate drive ringing dips below -4.5V for > 15ns during high dV/dt inductive switching transients, triggering gate dielectric trap accumulation and elevated Igss leakage.",
    source: "INC-2026-089 / Telemetry High-Speed Scope Analysis",
    confidence: 94,
    importance: "High",
    verificationStatus: "Verified",
    createdDate: "2026-10-25 10:14:00",
    tags: ["GaN", "Gate-Leakage", "Dielectric-Traps", "High-dV/dt"],
    verifiedBy: "Dr. Elena Rostova",
    notes: "Verified against semiconductor physical analysis and wafer lot qualification data."
  },
  {
    id: "MEM-2026-884",
    componentId: "CMP-FPG-1002",
    componentName: "Virtex UltraScale+ Space-Grade XQRKU060",
    systemId: "SYS-RAD-04",
    type: "Decision Memory",
    category: "Decision Memory",
    content: "Engineering Board approved immediate reduction of autonomous SEU scrub interval from 500ms to 50ms and enforced hardware crowbar trip threshold at 14.5A on VCCINT 0.95V rail to prevent permanent destructive latchup.",
    source: "INC-2026-074 / Mission Reliability Review Board",
    confidence: 98,
    importance: "Critical",
    verificationStatus: "Verified",
    createdDate: "2026-10-14 16:30:00",
    tags: ["SEL-Mitigation", "Scrub-Engine", "FPGA-Core", "Space-Radiation"],
    verifiedBy: "Marcus Vance",
    notes: "Mandatory firmware update pushed to all flying flight computer testbeds."
  },
  {
    id: "MEM-2026-872",
    componentId: "CMP-PMIC-5509",
    componentName: "TPS7H4001-SP Space Buck Converter",
    systemId: "SYS-AERO-01",
    type: "Outcome Memory",
    category: "Outcome Memory",
    content: "Replacing X7R ceramic soft-start capacitors with military-grade C0G/NP0 dielectric completely eliminated cold-start VDD overshoot below -40°C across 50 consecutive thermal-vacuum cycles.",
    source: "INC-2026-062 / Cryogenic Start-up Requalification Report",
    confidence: 96,
    importance: "Medium",
    verificationStatus: "Verified",
    createdDate: "2026-10-02 11:20:00",
    tags: ["Capacitor-Dielectric", "Cold-Boot", "Thermal-Vacuum", "Power-Rail"],
    verifiedBy: "Keshav Gattani",
    notes: "BOM revision B approved and locked into production Gerber files."
  },
  {
    id: "MEM-2026-840",
    componentId: "CMP-MCU-8920",
    componentName: "SAMV71Q21RT Rad-Hard Microcontroller",
    systemId: "SYS-AERO-01",
    type: "Observation Memory",
    category: "Observation Memory",
    content: "Empirical QSPI flash bus setup time degrades by 1.8ns for every 10°C increase in MCU junction temperature between 85°C and 115°C, requiring dynamic bus divider throttling in high-altitude hypersonic flight regimes.",
    source: "INC-2026-051 / High-Temp Environmental Lab Test",
    confidence: 91,
    importance: "Medium",
    verificationStatus: "Verified",
    createdDate: "2026-08-21 14:45:00",
    tags: ["QSPI-Timing", "Thermal-Derating", "Hypersonic", "Bus-Governor"],
    verifiedBy: "Aanya Patel",
    notes: "Telemetry governor algorithm incorporated into firmware build v4.2.1."
  },
  {
    id: "MEM-2026-815",
    componentId: "CMP-LDR-6621",
    componentName: "LMC6082 Precision Dual CMOS Op-Amp",
    systemId: "SYS-DRV-11",
    type: "Environmental Memory",
    category: "Environmental Memory",
    content: "Unbaked FR-4 laminate PCB absorbs up to 0.4% atmospheric moisture in coastal testing, producing parasitic surface leakage paths across high-impedance (100 MegOhm) transimpedance feedback resistors, drifting input offset by up to 280uV.",
    source: "INC-2026-042 / Failure Analysis Lab Scanning Electron Microscope",
    confidence: 88,
    importance: "High",
    verificationStatus: "Corrected",
    createdDate: "2026-08-05 09:10:00",
    tags: ["Moisture-Ingress", "Parylene-Coating", "Offset-Drift", "Surface-Leakage"],
    verifiedBy: "Keshav Gattani",
    notes: "Originally suspected internal die ionic contamination; corrected to PCB surface hygroscopic moisture accumulation after destructive physical analysis."
  },
  {
    id: "MEM-2026-790",
    componentId: "CMP-GAN-4401",
    componentName: "EPC2050 GaN Power Transistor",
    systemId: "SYS-SAT-02",
    type: "Maintenance Memory",
    category: "Maintenance Memory",
    content: "Thermal interface material for EPC2050 passivated dies must utilize pre-formed pure Indium foil (0.1mm thickness) with 15 psi uniform clamping pressure; standard silicon thermal pastes experience pump-out degradation under thermal cycling in vacuum.",
    source: "SAT-PCDU Space Assembly Standard Operating Procedure Rev 3",
    confidence: 99,
    importance: "High",
    verificationStatus: "Verified",
    createdDate: "2026-05-15 15:00:00",
    tags: ["Thermal-Pad", "Indium-Foil", "Thermal-Vacuum", "TIM-Pump-Out"],
    verifiedBy: "Dr. Elena Rostova",
    notes: "Mandatory qualification requirement for all spaceflight deployables."
  },
  {
    id: "MEM-2026-750",
    componentId: "CMP-FPG-1002",
    componentName: "Virtex UltraScale+ Space-Grade XQRKU060",
    systemId: "SYS-RAD-04",
    type: "Failure Memory",
    category: "Failure Memory",
    content: "Hypothesis: DSP tile 3 clock tree buffer may have sustained heavy-ion micro-damage lowering the critical charge (Qcrit) necessary to trigger single-event functional interrupts under multi-GHz vector matrix operations.",
    source: "Preliminary Rad-Hard Test Log - Beam Run 14",
    confidence: 62,
    importance: "Medium",
    verificationStatus: "Unverified",
    createdDate: "2026-10-26 18:20:00",
    tags: ["Hypothesis", "DSP-Clock", "Micro-Damage", "Heavy-Ion"],
    verifiedBy: "Pending Peer Review",
    notes: "Unverified preliminary assumption derived from single beam run telemetry; needs particle accelerator confirmation before treating as design rule."
  },
  {
    id: "MEM-2026-710",
    componentId: "CMP-ADC-3312",
    componentName: "AD9680 Dual 14-Bit 1.0 GSPS ADC",
    systemId: "SYS-CRYO-07",
    type: "Observation Memory",
    category: "Observation Memory",
    content: "Cryogenic vacuum cooling to 40 Kelvin increases ADC internal reference bandgap voltage stability by 4.2x with zero degradation in JESD204B high-speed serial PHY eye height.",
    source: "CSFE Cryo Calibration Run #09",
    confidence: 97,
    importance: "Medium",
    verificationStatus: "Verified",
    createdDate: "2026-06-18 13:40:00",
    tags: ["Cryo-Physics", "Bandgap-Stability", "JESD204B", "Low-Noise"],
    verifiedBy: "Dr. Chen Wei",
    notes: "Supports operating the RF front end at deeper cryogenic stages for sensor sensitivity gains."
  },
  {
    id: "MEM-2026-680",
    componentId: "CMP-PMIC-5509",
    componentName: "TPS7H4001-SP Space Buck Converter",
    systemId: "SYS-AERO-01",
    type: "Observation Memory",
    category: "Observation Memory",
    content: "Legacy assumption that tantalums were necessary on the converter input rail has been archived. Modern multi-layer ceramic capacitors (MLCC) with voltage derating to 40% provide superior ESR and space safety without fire hazard.",
    source: "Historic Mission Memo 2024-V2",
    confidence: 95,
    importance: "Low",
    verificationStatus: "Archived",
    createdDate: "2026-01-10 11:00:00",
    tags: ["Capacitor-Derating", "MLCC-vs-Tantalum", "Legacy-BOM"],
    verifiedBy: "Marcus Vance",
    notes: "Archived historical engineering guideline preserved for audit traceability."
  }
];

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
        text: "Based on historical telemetry records and verified engineering memories in SiliconSentinel, the EPC2050 GaN Power Transistor (`CMP-GAN-4401`) has exhibited critical vulnerabilities during rapid orbital thermal transitions:\n\n1. **Negative Gate Ringing & Trap Accumulation:** When inductive switching transients drive negative gate voltage below -4.5V for longer than 15ns, electron traps accumulate in the GaN 2DEG dielectric, causing Gate-Source leakage current (Igss) to jump up to 420x normal nominal levels.\n2. **Thermal Interface Material Pump-Out:** Standard silicone thermal greases degrade rapidly in vacuum under high thermal amplitude cycles. Pre-formed 0.1mm pure Indium foil under 15 psi uniform torque is required to prevent hotspot runaway.\n3. **Recommended Immediate Action:** Enforce active gate snubber damping and apply a 65% power derating limit until the gate drive circuitry is recalibrated.",
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
        feedback: "helpful"
      }
    ]
  }
];

// Precompute embeddings for initial memories
initialMemories.forEach((m) => {
  const { embedding } = embeddingService.cosineSimilarity ? { embedding: [] } : { embedding: [] };
  // Will be populated at runtime initialization
});

export const inMemoryStore = {
  systems: JSON.parse(JSON.stringify(initialSystems)),
  components: JSON.parse(JSON.stringify(initialComponents)),
  incidents: JSON.parse(JSON.stringify(initialIncidents)),
  memories: JSON.parse(JSON.stringify(initialMemories)),
  conversations: JSON.parse(JSON.stringify(initialConversations)),
  maintenance: [],
  users: [
    {
      id: "usr-001",
      name: "Keshav Gattani",
      email: "keshav.gattani@svnit.ac.in",
      role: "Lead Reliability & Avionics Engineer",
      team: "Team MC — SVNIT Nexus",
      clearanceLevel: "Level 3 Clearance",
    }
  ]
};

// Initialize embeddings for inMemoryStore memories
(async () => {
  for (const mem of inMemoryStore.memories) {
    const { embedding } = await embeddingService.generateEmbedding(`${mem.componentId} ${mem.type} ${mem.content}`);
    mem.embedding = embedding;
  }
})();

