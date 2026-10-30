# Loan-LMS (Loan Management System) Frontend

A modern, enterprise-grade Frontend UI for the Loan Management System (LMS) built with **Next.js**, **React 19**, **Tailwind CSS**, **Radix UI**, **Base UI**, **Motion**, and **GSAP**, connected directly to the production backend API at [`https://loan.cavkim.tech`](https://loan.cavkim.tech).

[![Backend API Docs](https://img.shields.io/badge/Swagger_UI-Docs-green.svg)](https://loan.cavkim.tech/webjars/swagger-ui/index.html)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Base UI](https://img.shields.io/badge/Base_UI-1.9.0-6366f1.svg)](https://base-ui.com/)
[![Motion](https://img.shields.io/badge/Motion-Dev-f43f5e.svg)](https://motion.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88ce02.svg)](https://gsap.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet.svg)](https://web.dev/progressive-web-apps/)

---

## 🚀 Technology Stack

| Technology | Purpose | Documentation / Link |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | High-performance React framework, Server-side proxy rewrites | [nextjs.org](https://nextjs.org/) |
| **React 19** | Component architecture, modern state management | [react.dev](https://react.dev/) |
| **Tailwind CSS v4** | Modern utility-first styling with dark/light themes | [tailwindcss.com](https://tailwindcss.com/) |
| **Radix UI Primitives** | Unstyled accessible primitives (Dialog, Tabs, Select, Dropdown, Avatar, Label) | [radix-ui.com](https://www.radix-ui.com/) |
| **Base UI (`@base-ui/react`)** | Headless UI primitives (Interactive Loan Calculator Sliders & Toggle Switches) | [base-ui.com](https://base-ui.com/) |
| **Motion (`motion/react`)** | Fluid page transitions, modal entrances, button micro-interactions | [motion.dev](https://motion.dev/) |
| **GSAP (`gsap`)** | Real-time animated number rollups for financial KPI counters | [gsap.com](https://gsap.com/) |
| **Recharts** | Visual charts (Disbursements vs Collections Area Chart, Portfolio Status Donut) | [recharts.org](https://recharts.org/) |
| **Lucide React** | Clean icons for financial workflows | [lucide.dev](https://lucide.dev/) |
| **Sonner** | Toast notifications for async API feedback | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/) |

---

## 📡 Backend API Connectivity

The frontend connects to the backend gateway at **`https://loan.cavkim.tech`** (Swagger docs: [`https://loan.cavkim.tech/webjars/swagger-ui/index.html`](https://loan.cavkim.tech/webjars/swagger-ui/index.html)).

Next.js configured with server-side proxy rewrites (`/backend-api/:path*` ➔ `https://loan.cavkim.tech/:path*`), ensuring **zero CORS issues** across environments.

### Services Integrated:
1. **Auth Service (`/auth-docs/v3/api-docs`)**:
   - `POST /api/v1/auth/login` - Authenticate with JWT access & refresh tokens
   - `POST /api/v1/auth/refresh` - Transparent token refresh interceptor
   - `POST /api/v1/auth/logout` - Secure logout
   - `GET /api/v1/users/me` - User profile
   - `GET /api/v1/roles` - Role-based permissions
2. **Operation Service (`/operation-docs/v3/api-docs`)**:
   - **Loan Products**: `GET /api/v1/loan-products`, `POST /api/v1/loan-products`, `PATCH /api/v1/loan-products/{id}/status`
   - **Customers**: `GET /api/v1/customers`, `POST /api/v1/customers`, `GET /api/v1/customers/{id}/employment`, `POST /api/v1/customers/{id}/employment`
   - **Applications**: `GET /api/v1/applications`, `POST /api/v1/applications`, `POST /api/v1/applications/{id}/submit`, `POST /api/v1/applications/{id}/approval`, `POST /api/v1/applications/{id}/disburse`
   - **Risk & Collateral**: `GET/POST /api/v1/applications/{id}/risk-assessment`, `GET/POST /api/v1/applications/{id}/guarantors`, `GET/POST /api/v1/applications/{id}/collaterals`, `GET /api/v1/applications/{id}/documents`
   - **Schedules & Repayments**: `GET /api/v1/loan-schedules`, `GET /api/v1/loan-schedules/{loanId}`, `POST /api/v1/repayments`, `POST /api/v1/loans/{id}/payments/{pid}/pay`
   - **Daily Collections**: `GET /api/v1/collections/daily/employees/{employeeId}`
   - **Notifications**: `GET /api/v1/notifications`, `PATCH /api/v1/notifications/{id}/read`
3. **Report Service (`/report-docs/v3/api-docs`)**:
   - `GET /api/v1/reports/dashboard` - Metric aggregates
   - `GET /api/v1/reports/loans` - Loans portfolio report
   - `GET /api/v1/reports/payments` - Repayments ledger

---

## 🛠️ Features & Pages

### 1. Interactive Dashboard (`/dashboard` or `/`)
- **GSAP Rollup KPI Cards**: Total Disbursed (`$14.5M`), Total Collected (`$9.8M`), Active Loans (`284`), Overdue/PAR 30 (`19`).
- **Performance Area Chart**: Monthly disbursements vs repayments trend.
- **Portfolio Donut**: Health breakdown (Active, Settled, Grace Period, Overdue).
- **Loan Amortization Simulator**: Drag amount and duration sliders powered by **Base UI Slider** (`@base-ui/react`) to calculate monthly installments and total interest live.
- **Quick Modals**: New Application Wizard, Register Customer, Record Repayment.

### 2. Loan Applications (`/applications`)
- Filter by status: `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `DISBURSED`, `REJECTED`.
- Detailed Inspection Drawer with 5 tabs:
  - **Overview**: Terms, purpose, audit timeline.
  - **Risk Score**: Score meter (0-1000), grade badge, and underwriter comments.
  - **Guarantors**: Identity and 1-click verification.
  - **Collaterals**: Pledged asset descriptions and valuation.
  - **Documents**: Uploaded files and verification status.
- Workflow action buttons: **Submit to Review**, **Approve Facility**, **Disburse Funds**.

### 3. Customers Directory (`/customers`)
- Search by name, national ID, or phone number.
- Customer dossiers with verified national ID, address, and contact info.
- Employment records with employer name, occupation, verified monthly income, and years of service.

### 4. Loan Products Catalog (`/products`)
- Model APR interest rates, minimum income requirements, max ceilings, and processing fees.
- 1-click Activate/Deactivate product status toggle (`PATCH /api/v1/loan-products/{id}/status`).
- Modal to create new credit facilities.

### 5. Loan Schedules & Repayments (`/loans`)
- Paginated active loan schedule cards with visual repayment progress meters.
- Complete Amortization Schedule table: installment #, due dates, principal, interest, total due, and status.
- Instant "Pay Now" per installment or full Repayment Dialog with bank reference receipting.

### 6. Daily Collections (`/collections`)
- Cashier and loan officer daily register reconciliation (`/api/v1/collections/daily/employees/{id}`).
- Cash drawer breakdown vs digital bank transfers (ABA/Bakong).
- Grand total collected today with print and seal functionality.

### 7. Financial Reports (`/reports`)
- Tabbed reports for **Loans Portfolio** and **Payments Inflow**.
- One-click **Export to CSV** for spreadsheets and audits.
- Printable statements.

### 8. Progressive Web App (PWA) Capabilities
- **Installable Standalone App**: One-click install prompt on Chrome, Edge, Safari, iOS, and Android.
- **Service Worker Caching**: Offline asset precaching (`public/sw.js`) with cache-first and stale-while-revalidate strategies.
- **App Shortcuts**: Quick launch into Applications, Customers, and Loan Schedules directly from device home screen or app dock.
- **Network Status Detection**: Real-time toast notifications when network goes offline or reconnects to the live gateway.

---

## ⚡ Live & Demo Mode Switch

The system supports two operating modes:
- **Live Mode**: Directly requests your live backend endpoints at `https://loan.cavkim.tech`.
- **Demo Mode**: Switchable anytime via the navbar toggle switch or 1-click button on login. Allows exploring all features, forms, and charts with rich realistic data even offline.

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```
