# Multi-Tenant AI Assistant Platform

A production-quality, multi-tenant AI platform built with Next.js 15, MongoDB, and Gemini AI. This platform features a clean layered architecture, role-based access control, and a fully config-driven admin dashboard.

##  Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB + Mongoose
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **AI**: Google Gemini (1.5 Flash)

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ai-platform
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
AUTH_SECRET=supersecretkey
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed the Database
**CRITICAL**: You must run the seed script to create the projects, users, and dashboard configurations.
```bash
node scripts/seed.js
```

### 5. Run the App
```bash
npm run dev
```

---

##  Architecture Layers
This project strictly follows a layered architecture to ensure scalability and maintainability:

1.  **Access Layer (`lib/access.ts`)**: Pure, side-effect-free authorization functions.
2.  **Service Layer (`services/`)**: Business logic and external API integrations (AI, Shopify/CRM mocks).
3.  **API Routes (`app/api/`)**: Thin handlers that orchestrate access control and services.
4.  **Hooks Layer (`hooks/useApi.ts`)**: TanStack Query hooks for client-side data fetching and state management.
5.  **UI Layer (`components/`)**: Clean, modern React components using Tailwind CSS.

---

## Key Features

### 1. Multi-Tenancy & RBAC
- **Projects**: Act as isolated tenants.
- **Roles**: `admin` and `member`.
- **Authorization**: Enforced server-side in API routes via the Access Layer.

### 2. Config-Driven Admin Dashboard
The Admin Dashboard UI is **completely dynamic**. It is rendered based on the `DashboardConfig` document in MongoDB.
- **Location**: `components/dashboard/DashboardRenderer.tsx`
- **Proof**: Modify the `dashboardconfigs` collection in MongoDB (e.g., change widget order, types, or titles), and the UI will update instantly without any code changes.

### 3. Integrated AI Assistant
- **Context Injection**: Detects project integrations (Shopify/CRM) and injects mock live data context into AI prompts.
- **Step Logs**: Displays AI's "internal process" (Thinking, Analyzing, Fetching) to the user.
- **Rate Limiting**: Graceful handling of API quotas and fallbacks.

---

## Testing Multi-Tenancy
Use the following mock accounts after seeding:
- **Admin (Project 1)**: `admin@project1.com` (Full access to Dashboard + Chat)
- **Member (Project 1)**: `member@project1.com` (Access to Chat only)
- **Admin (Project 2)**: `admin@project2.com` (Different project context)

---

##  Project Structure
- `app/`: Next.js App Router (Routes & Pages)
- `components/`: UI Components
- `hooks/`: Custom TanStack Query hooks
- `lib/`: Core utilities (DB, Auth, Access, API Response)
- `models/`: Mongoose Schemas
- `services/`: AI and Integration logic
- `scripts/`: Database seeding utilities
- `types/`: TypeScript definitions
