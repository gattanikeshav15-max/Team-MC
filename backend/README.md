# 🛡️ SiliconSentinel — Backend API & VAJRA Agentic Memory Engine

This is the Node.js/Express backend service powering **SiliconSentinel** and its persistent **VAJRA Agentic Memory Engine**.

---

## ⚡ Quickstart

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env` if not already present:
```bash
cp .env.example .env
```

Open `backend/.env` and paste your credentials:

```ini
# 1. MongoDB Atlas Connection URI
# Paste your connection string from Atlas Dashboard (Drivers -> Node.js):
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/silicon_sentinel?retryWrites=true&w=majority

# 2. Google Gemini API Key
# Paste your Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash

# Port & Secrets
PORT=5000
JWT_SECRET=silicon_sentinel_defense_grade_secret_key_2026
CLIENT_ORIGIN=http://localhost:5173
```

> **Zero-Downtime Demo Mode**: If `MONGODB_URI` or `GEMINI_API_KEY` are not configured, the backend starts automatically in **Standalone Development / Demo Mode** with in-memory seeded semiconductor telemetry, real vector cosine ranking, and zero crashes. Simply add your credentials and restart to switch to live mode!

### 3. Run Automated Integration Test Suite
```bash
node src/utils/testSuite.js
```
Runs 12 comprehensive end-to-end tests verifying:
- Authentication
- System registration
- Component allocation
- Incident reporting
- Autonomous VAJRA memory extraction
- Database persistence verification
- Grounded memory retrieval
- Semantic vector similarity without keyword mention
- Heuristic correction with immutable audit trail
- Zero fabrication on nonexistent components
- Model alignment feedback recording

### 4. Start the Server
```bash
npm run dev
```
The backend will listen on `http://localhost:5000`.

---

## 🔍 MongoDB Atlas Vector Search Configuration

To enable semantic retrieval via MongoDB Atlas Vector Search:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to your cluster -> **Atlas Search** tab -> **Create Search Index**.
3. Select **Atlas Vector Search (JSON Editor)**.
4. Select the Database: `silicon_sentinel` and Collection: `memories`.
5. Name the index: `vector_index_memories`.
6. Paste the following configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "componentId"
    },
    {
      "type": "filter",
      "path": "systemId"
    },
    {
      "type": "filter",
      "path": "verificationStatus"
    }
  ]
}
```

7. Click **Create Search Index**.
8. Atlas will index the vectors. VAJRA's `MemoryRetrievalAgent` will automatically detect the index and route `$vectorSearch` pipeline stages through Atlas!

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` — Register a new engineer account
- `POST /api/auth/login` — Login and receive JWT token
- `GET /api/auth/me` — Inspect authenticated engineer profile

### Electronic Systems
- `GET /api/systems` — List electronic platforms
- `POST /api/systems` — Register platform (Avionics, Radar, PCDU, LiDAR)
- `GET /api/systems/:id` — Platform profile & allocated parts
- `PATCH /api/systems/:id` — Update platform
- `DELETE /api/systems/:id` — Remove platform

### Semiconductor Components
- `GET /api/components` — List semiconductor parts (supports `?category=`, `?systemId=`, `?status=`)
- `POST /api/components` — Register part with technical specs
- `GET /api/components/:id` — Detailed component profile & MTBF
- `PATCH /api/components/:id` — Update technical specifications
- `DELETE /api/components/:id` — Delete part

### Hardware Incidents
- `GET /api/incidents` — List anomalies (supports `?severity=`, `?status=`)
- `POST /api/incidents` — Log anomaly & **trigger autonomous VAJRA memory extraction**
- `GET /api/incidents/:id` — Incident breakdown
- `PATCH /api/incidents/:id` — Update status or outcome
- `GET /api/incidents/:id/analysis` — Correlate with historical failure modes

### VAJRA Agentic Memories
- `GET /api/memory` — List engineering memories (Observation, Failure, Maintenance, Decision, Outcome)
- `POST /api/memory/extract` — Manually trigger extraction from an incident
- `POST /api/memory/search` — Perform semantic vector retrieval (`{ query, componentId, limit }`)
- `PATCH /api/memory/:id` — Verify (`action: 'verify'`), unverify, or correct with audit reason (`action: 'correct'`)
- `DELETE /api/memory/:id` — Purge memory

### VAJRA AI Assistant
- `POST /api/ai/chat` — Context-aware AI synthesis citing grounded memory records
- `GET /api/ai/conversations` — Session history
- `GET /api/ai/conversations/:id` — Conversation messages
- `POST /api/ai/feedback` — Submit feedback (`helpful`, `not-helpful`, `incorrect`)

### System & Diagnostics
- `GET /api/health` — Atlas connection status, Gemini status, and vector index health
- `GET /api/stats` — Fleet totals and memory verification ratios
- `POST /api/seed` — Seed initial semiconductor baseline dataset
