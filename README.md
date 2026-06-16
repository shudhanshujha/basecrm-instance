# Generic Multi-Tenant CRM

A robust, industry-agnostic CRM for managing clients, deals, invoicing, payments, and expenses. Designed to be a clean starting point for any business, regardless of vertical.

## 🚀 Features

- **Multi-Tenant Architecture**: Support for multiple organizations with isolated data.
- **Client & Contact Management**: Comprehensive CRUD with activity history and notes.
- **Deal Pipeline**: Track sales engagements from Lead to Completed status.
- **Asset Inventory**: Manage business resources, products, or service slots.
- **Flexible Invoicing**: Professional invoice generation with configurable tax modes (None, Single Tax, GST India).
- **Accounts Receivable & Payable**: Track both client payments and vendor payouts.
- **Financial Reporting**: Real-time P&L reports, revenue trends, and tax summaries.
- **Document Storage**: Secure file attachments for deals, invoices, and expenses.
- **Integrated Dashboard**: High-level KPIs and business performance metrics.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query, Recharts, Lucide React
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL (Prisma support for SQLite/MySQL)
- **Utilities**: @react-pdf/renderer, jspdf, xlsx, papaparse

## 🔄 Generic Workflow

1. **Onboard Clients**: Add company and contact details to the database.
2. **Track Deals**: Create new deals/projects and assign associated assets or resources.
3. **Log Activities**: Track progress and milestones through the activity log system.
4. **Generate Invoices**: Create professional invoices with automatic tax calculations.
5. **Reconcile Payments**: Record receivables from clients and payables to vendors.
6. **Analyze Performance**: Review P&L reports and growth trends on the dashboard.

## 🏁 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install` in both root, backend, and client folders.
3. Set up your `.env` file (see `.env.example`).
4. Initialize the database: `npx prisma migrate dev`
5. Run the development servers: `npm run dev`

---

*Clean, Modular, and Scalable — adaptable to any industry.*
