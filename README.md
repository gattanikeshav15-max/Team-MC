# 🛡️ SiliconSentinel — AI-Powered Semiconductor Engineering Memory & Reliability Intelligence

> **Tagline:** *Engineering Intelligence That Never Forgets.*  
> **Team:** Team MC (`NEXUS UNCHARTED 2026`, SVNIT Surat)  
> **Track:** PS1 — Track 1: Agentic Memory (MongoDB Student Hackathon)  
> **Lead:** Keshav Gattani  

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Vector_Search-47A248.svg)](https://www.mongodb.com/products/platform/atlas-vector-search)

---

## 🌟 Executive Overview

**SiliconSentinel** is an enterprise-grade reliability intelligence and agentic engineering memory platform tailored for defense electronics, aerospace avionics, and mission-critical semiconductor systems.

At its core is **VAJRA**, an AI-powered memory engine built to address a critical industry vulnerability: **tribal knowledge decay and repeated semiconductor failure modes**. When high-altitude GaN transistors experience gate dielectric trap breakdown or space-grade FPGAs suffer Single-Event Latchups (SEL), traditional bug-tracking systems store static tickets. 

**VAJRA transforms electronic anomalies into persistent, semantic, auditable engineering memories.**

---

## 🧠 Core Pillars: Agentic Memory with MongoDB

SiliconSentinel solves the three fundamental demands of the **Agentic Memory Hackathon Challenge**:

1. **Persistent Memory Modeling:**  
   Every memory document is structured with `owner`, `componentId`, `memoryType`, `content`, `source`, `confidence`, `importance`, and lifecycle state (`Verified`, `Unverified`, `Corrected`, `Archived`).

2. **Grounded Semantic Retrieval (MongoDB Atlas Vector Search):**  
   VAJRA does not hallucinate answers like a generic chatbot. Every response cites **Retrieved Engineering Memories**, displaying their memory ID, source incident, confidence score, and verification status.

3. **Lifecycle Integrity & Verification Protocol:**  
   - **Verified Information:** Confirmed engineering facts and peer-reviewed design heuristics.
   - **Unverified Assumptions:** Preliminary hypotheses clearly highlighted with warning states so they are never confused with established fact.
   - **Correction Audit Trails:** Technical corrections preserve full change history and engineering justifications.
   - **TTL & Expiry:** Transient observations are automatically scheduled for archival or TTL index cleanup.

---

## 🚀 Key Modules & Architecture

```
React 19 Frontend (Vite + Tailwind v4)
            │
            ▼ (Centralized Axios Service Layer with JWT / Fallback)
Node.js + Express API Gateway (http://localhost:5000)
            │
            ▼
      VAJRA AI Core
 ┌──────────┴──────────┐
 │ Memory Extraction   │
 │ Semantic Search     │
 │ Latchup / Heuristics│
 └──────────┬──────────┘
            │
            ▼
MongoDB Atlas (Document Store + Vector Search Indexes + Change Streams)
```

### Application Pages:

1. **Overview Dashboard (`/`):**
   - KPI metrics: Total Systems, Registered Components, Total Incidents, Verified Memories, Pending Investigations.
   - Fleet Reliability Index vs Memory Extraction rate line chart.
   - Active systems telemetry feed, recent incidents, recent VAJRA memories, and Atlas vector sync status.

2. **Electronic Systems Management (`/systems`, `/systems/:id`):**
   - Platform catalog (Avionics Computers, Phased-Array Radars, Satellite PCDUs, LiDAR Hubs, Cryogenic Sensors).
   - Full CRUD modal forms, reliability scores, and detailed subsystem component rosters.

3. **Component Registry (`/components`, `/components/:id`):**
   - High-density semiconductor tracking table with multi-factor filters (Category, System, Status).
   - Component modal for registering GaN FETs, radiation-hardened MCUs, FPGAs, and PMICs.
   - Detailed component profile: Technical specs (Vds, TID radiation tolerance, thermal limits), maintenance logs, incident history, and related VAJRA memories.

4. **Incident & Anomaly Management (`/incidents`, `/incidents/:id`):**
   - Logging of electronic telemetry glitches, gate leakage surges, and Single-Event Latchup events.
   - Autonomous pipeline: logging an incident automatically triggers VAJRA memory extraction into the persistent store.
   - Root-cause analysis, similar incident correlations, and corrective resolution tracking.

5. **VAJRA AI Assistant (`/vajra`):**
   - Mission intelligence chat console with suggested prompts and conversation histories.
   - Retrieval-augmented responses with a dedicated **Retrieved Engineering Memories** section showing similarity distances and citations.
   - Engineer feedback loop: *Helpful*, *Not Helpful*, *Report Incorrect Information*.

6. **Memory Explorer (`/memories`):**
   - Dedicated interface for the agentic memory repository.
   - Filter by categories: `Observation Memory`, `Failure Memory`, `Maintenance Memory`, `Environmental Memory`, `Decision Memory`, `Outcome Memory`.
   - Actions: **Verify Memory**, **Mark Unverified**, **Correct Heuristic** (with audit justification modal), **Archive**, and **Purge**.

7. **Reliability Analytics (`/analytics`):**
   - Recharts analytical suite: Fleet reliability degradation curves, incidents by severity, memory category distribution donut, verification rigor ratio, and depot maintenance activities.

8. **Platform Settings (`/settings`):**
   - Lead engineer credentials, MongoDB Atlas vector threshold tuning, TTL index retention settings, and local demo state reset.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Build** | React 19, Vite 8.3 |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons |
| **Routing** | React Router DOM v7 |
| **Data Visualization** | Recharts (Responsive Line, Area, Bar, Pie charts) |
| **HTTP & Services** | Axios (Centralized API Gateway with Bearer Interceptors) |
| **State & Persistence** | React Context (`AppDataContext`, `ToastContext`) + LocalStorage Fallback |
| **Target Database** | MongoDB Atlas (Vector Search, TTL Indexes, Document Modeling) |

---

## ⚡ Quickstart Guide

### 1. Clone & Enter Directory
```bash
git clone https://github.com/gattanikeshav15-max/Team-MC.git
cd Team-MC
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `VITE_API_BASE_URL` is configured to `http://localhost:5000`. If the backend is offline, the frontend seamlessly operates in **Intelligent Mock Mode with Local Storage persistence**.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production Deployment
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 👥 Team MC (NEXUS UNCHARTED 2026)

- **Team Leader:** Keshav Gattani (`gattanikeshav15-max`)
- **Institution:** Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat
- **Organizers:** NEXUS — Official DoCSE & DoAI Cell, SVNIT Surat
- **Collaborators:** MongoDB & n8n
