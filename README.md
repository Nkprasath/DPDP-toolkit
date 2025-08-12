DPDP Consent & Rights MVP (Local)

------------------
Structure:
- backend/: Node.js + Express + Mongoose API (port 4000)
- frontend/: Vite + React simple UI (port 5173)

Quick start (Windows - PowerShell):

1) Ensure Node.js (>=18), npm, and MongoDB are installed.
2) Start MongoDB (either as service or run mongod --dbpath C:\data\db)
3) Backend:
   cd backend
   npm install
   copy .env.example .env
   npm run dev
4) Frontend:
   cd frontend
   npm install
   npm run dev
5) Visit http://localhost:5173

Endpoints:
POST /api/consent  -> save consent (body: principal_identifier, categories, action, consent_text)
GET  /api/consent  -> list recent consent events
POST /api/dsar     -> create DSAR
GET  /api/dsar     -> list DSARs
GET  /_health      -> health check

Note: This is a local MVP for development only. Harden before production.
