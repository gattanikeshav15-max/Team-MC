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
    description: "High-efficiency enhancement-mode GaN FET used in the synchronous buck converter stage of satellite solar bus regulation.",
    maintenanceHistory: [
      { date: "2026-03-10", action: "Thermal interface material re-application with Indium foil", technician: "K. Gattani" },
      { date: "2026-05-22", action: "Gate drive ringing snubber circuit recalibration", technician: "E. Rostova" }
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
    description: "Radiation-tolerant supervisory mission microcontroller executing attitude determination and fault containment algorithms.",
    maintenanceHistory: [
      { date: "2026-02-14", action: "Bootloader ROM parity check and flash ECC integrity test", technician: "M. Vance" }
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
      transceivers: "32 GTH @ 12.5Gbps",
      packageType: "Ceramic Column Grid Array (CFGA1509)",
      coreVoltage: "0.95V VCCINT",
      tempRange: "-55°C to +125°C"
    },
    description: "Massive digital signal processing FPGA driving true-time-delay coefficients for 64 RF phased antenna elements.",
    maintenanceHistory: [
      { date: "2026-04-18", action: "Replaced switching regulator decoupling capacitor bank", technician: "A. Patel" },
      { date: "2026-07-02", action: "SEU soft error scrub engine firmware revision uploaded", technician: "K. Gattani" }
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
      resolution: "14-Bit Dual Channel",
      sampleRate: "1.0 GSPS",
      snr: "65.3 dBFS at 1 GHz",
      sfdr: "78 dBc at 1 GHz",
      interface: "JESD204B High Speed Serial",
      powerDissipation: "1.65 W per channel"
    },
    description: "High-speed direct RF sampling analog-to-digital converter operating in low-noise scientific sensor arrays.",
    maintenanceHistory: [
      { date: "2026-04-10", action: "JESD204B link eye-diagram margin testing under cryo vacuum", technician: "Dr. Chen Wei" }
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
      inputVoltage: "3V to 7V",
      outputCurrent: "18A Synchronous Step-Down",
      feedbackAccuracy: "+/- 1.0% over temp & rad",
      radHardness: "TID 100 krad(Si), SEE immune to LET = 75",
      packageType: "Thermally Enhanced TSSOP-28",
      switchingFrequency: "Programmable 100 kHz - 1 MHz"
    },
    description: "Point-of-Load buck converter supplying low-noise 0.95V core voltage rails to mission-critical processors.",
    maintenanceHistory: [
      { date: "2026-03-02", action: "Output filter choke saturation test under full step load", technician: "E. Rostova" }
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
      inputBiasCurrent: "10 fA typical",
      offsetVoltage: "150 uV max",
      gainBandwidth: "1.3 MHz",
      supplyVoltage: "4.5V to 15.5V Rail-to-Rail",
      packageType: "SOIC-8 Industrial Grade",
      tempRange: "-40°C to +85°C"
    },
    description: "Ultra-low input current amplifier used for photodiode transimpedance amplification in LiDAR receiver circuits.",
    maintenanceHistory: [
      { date: "2026-06-11", action: "Conformal coating inspection and humidity ingress dry-bake", technician: "A. Patel" }
    ]
  }
];

