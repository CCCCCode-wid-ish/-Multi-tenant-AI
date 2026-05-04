Multi-Tenant AI Assistant Platform

A production-quality, multi-tenant AI platform built with Next.js, MongoDB, and Gemini AI. This project demonstrates clean architecture, role-based access control, and a fully config-driven admin dashboard.

 Features
Multi-tenant architecture (project-based isolation)
AI-powered chat system (Google Gemini)
Role-based access control (admin / member)
Integration simulation (Shopify + CRM)
Config-driven admin dashboard (MongoDB controlled)
Clean layered architecture for scalability
🛠️ Tech Stack
Framework: Next.js (App Router)
Language: TypeScript
Styling: Tailwind CSS
Database: MongoDB + Mongoose
State Management: TanStack Query
Validation: Zod
AI: Gemini (1.5 Flash)
⚙️ Setup Instructions
1. Prerequisites
Node.js 18+
MongoDB (Local or Atlas)
Gemini API Key (from Google AI Studio)
2. Installation
npm install
3. Environment Variables

Create a .env.local file:

MONGODB_URI=mongodb://localhost:27017/ai-platform
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
AUTH_SECRET=your_secure_random_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
4. Seed the Database



node scripts/seed.js

This will create:

Sample users (admin & member)
Sample projects (multi-tenant setup)
Dashboard configuration (for admin UI)
5. Run the Application
npm run dev

 Architecture

This project follows a strict layered architecture:

Access → Services → Routes → Hooks → UI
Access Layer (lib/access.ts)
Pure authorization rules (who can access what)
Service Layer (services/)
Business logic, database interaction, AI calls
API Routes (app/api/)
Thin handlers connecting access + services
Hooks (hooks/)
Client-side data fetching using TanStack Query
UI (components/)
Presentation layer using React + Tailwind
 Multi-Tenant Model

Each project acts as a tenant.

All data is scoped using projectId
Includes:
Users
Conversations
Product instances
Users cannot access other project data
Ensures complete data isolation between tenants
 Role-Based Access Control (RBAC)
Admin
Access to admin dashboard
Full project control
Member
Access to chat system only

All authorization is enforced server-side via Access Layer.

AI + Integrations
AI Integration
Uses Gemini API (real)
Controlled via service layer
Includes:
Rate limit handling
Fallback responses
Integration Simulation
Shopify (mocked)
CRM (mocked)

Stored in MongoDB as toggles:

{
  "shopify": true,
  "crm": false
}

Chat responses adapt based on enabled integrations.

Config-Driven Admin Dashboard

The admin dashboard UI is fully controlled by MongoDB.

Collection: dashboardconfigs
Renderer: components/dashboard/DashboardRenderer.tsx
Example Config:
{
  "sections": [
    {
      "title": "Overview",
      "widgets": ["stats", "activity"]
    }
  ]
}
 Behavior:
UI is generated dynamically from this config
Editing MongoDB updates UI instantly
No code changes required

 NOTE: Config-driven behavior is implemented ONLY for the admin dashboard as per assignment requirements.

 Testing Multi-Tenancy

After seeding:

Admin (Project 1): admin@project1.com
Member (Project 1): member@project1.com
Admin (Project 2): admin@project2.com

Each project has isolated data and context.

 API Overview
GET /api/projects
POST /api/conversations
GET /api/conversations/:id
POST /api/chat
GET /api/admin/dashboard-config
 Assumptions & Mocked Components
Authentication is simplified (mock login system)
Shopify and CRM integrations are simulated
AI uses Gemini API with fallback handling
Focus is on system design and architecture over UI complexity
📁 Project Structure
app/          → Next.js routes
components/   → UI components
hooks/        → TanStack Query hooks
lib/          → Utilities (DB, Auth, Access)
models/       → Mongoose schemas
services/     → Business logic + AI
scripts/      → Seed scripts
types/        → TypeScript types
