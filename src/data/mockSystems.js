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

