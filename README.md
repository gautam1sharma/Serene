# Serene Automotive — Dealership Management System

> **Drive the calm.** A premium luxury automotive dealership platform built with React, TypeScript, and Tailwind CSS. Featuring a cinematic public-facing website, role-based dashboards for customers / dealers / managers / executives, and a full mock-data service layer.

---

## Table of Contents

- [Overview](#overview)
- [Live Preview](#live-preview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Routing & Navigation](#routing--navigation)
- [Role-Based Access Control](#role-based-access-control)
- [Pages & Features](#pages--features)
- [Design System](#design-system)
- [Performance Optimisations](#performance-optimisations)
- [Data Layer & Services](#data-layer--services)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Serene is a full-featured **Dealership Management System (DMS)** fronted by a cinematic marketing website. It demonstrates:

- **Multi-tier role-based architecture** — Customer, Dealer, Manager, CEO/Admin each get their own dashboard with tailored views.
- **Premium editorial design** — Dark cinematic homepage with video hero, glassmorphism stat cards, Playfair Display serif typography, and smooth Framer Motion animations.
- **Performance-first engineering** — Route-level code splitting with `React.lazy()`, image lazy loading, `@tanstack/react-query` caching, debounced search, and dynamic page titles via `react-helmet-async`.

---

## Live Preview

```
npm run dev
# → http://localhost:5173
```

### Demo Credentials

| Role     | Email                       | Password      |
|----------|-----------------------------|---------------|
| Customer | `john.customer@email.com`   | `password123` |
| Dealer   | `sarah.dealer@email.com`    | `password123` |
| Manager  | `michael.manager@email.com` | `password123` |
| CEO      | `david.ceo@email.com`       | `password123` |

---

## Tech Stack

| Layer           | Technology                                                            |
|-----------------|-----------------------------------------------------------------------|
| **Framework**   | React 18 + TypeScript                                                 |
| **Bundler**     | Vite 7                                                                |
| **Styling**     | Tailwind CSS 4 + custom design tokens                                 |
| **UI Library**  | Radix UI primitives (via shadcn/ui)                                   |
| **Animations**  | Framer Motion                                                         |
| **Routing**     | React Router v6 (nested, role-guarded)                                |
| **Data Fetching** | @tanstack/react-query (staleTime 5 min, gcTime 10 min)             |
| **SEO**         | react-helmet-async (dynamic `<title>` and meta per page)              |
| **Fonts**       | Google Fonts: Inter (body), Playfair Display (serif headings), Public Sans |
| **Icons**       | Lucide React + Google Material Symbols                                |
| **Toasts**      | Sonner                                                                |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Hyundai.in

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Command           | Description                       |
|-------------------|-----------------------------------|
| `npm run dev`     | Start Vite dev server (HMR)       |
| `npm run build`   | TypeScript check + production build |
| `npm run preview` | Preview production build locally  |
| `npm run lint`    | Run ESLint                        |

---

## Project Structure

```
src/
├── App.tsx                    # Root router + Suspense + role guards
├── main.tsx                   # Entry point (React.createRoot)
├── index.css                  # Global CSS + Tailwind directives + custom utilities
│
├── assets/                    # Static assets (SVG logos)
│
├── components/
│   ├── layout/
│   │   ├── TopNav.tsx         # ★ Primary navigation bar (role-aware, responsive)
│   │   ├── MainLayout.tsx     # Layout shell: TopNav → content → footer
│   │   ├── AuthLayout.tsx     # Light-themed auth layout (customer login/register)
│   │   ├── AdminAuthLayout.tsx # Dark DMS-themed auth layout (dealer/manager/CEO)
│   │   ├── Header.tsx         # Legacy header (preserved for reference)
│   │   └── Sidebar.tsx        # Legacy sidebar (preserved for reference)
│   └── ui/                    # 50+ Radix UI/shadcn primitives (button, card, dialog…)
│
├── contexts/
│   └── AuthContext.tsx         # Authentication state + login/logout/register
│
├── dashboards/
│   ├── customer/              # Customer-specific dashboard views
│   │   ├── CustomerDashboard.tsx   # ★ Premium editorial dashboard
│   │   ├── CarBrowser.tsx          # Vehicle grid with filters + lazy images
│   │   ├── CarDetails.tsx          # Full car detail page + full-screen gallery
│   │   ├── MyTestDrives.tsx        # Upcoming/past test drive list
│   │   ├── MyOrders.tsx            # Order history + tracking
│   │   └── MyInquiries.tsx         # Customer inquiry list
│   ├── dealer/                # Dealer-specific dashboard views
│   │   ├── DealerDashboard.tsx
│   │   ├── InventoryManagement.tsx
│   │   ├── CustomerInquiries.tsx
│   │   ├── TestDriveSchedule.tsx
│   │   └── SalesProcessing.tsx
│   ├── manager/               # Manager-specific dashboard views
│   │   ├── ManagerDashboard.tsx
│   │   ├── TeamManagement.tsx
│   │   ├── DealershipOperations.tsx
│   │   └── SalesReports.tsx
│   └── ceo/                   # CEO/Admin-specific dashboard views
│       ├── CEODashboard.tsx
│       ├── MultiDealershipView.tsx
│       ├── FinancialAnalytics.tsx
│       ├── StrategicPlanning.tsx
│       └── UserManagement.tsx
│
├── data/
│   └── mockData.ts            # Comprehensive mock database (users, cars, orders…)
│
├── hooks/
│   └── useDebounce.ts         # Debounced value hook (search optimisation)
│
├── lib/
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
│
├── pages/
│   ├── HomePage.tsx           # ★ Cinematic homepage (video hero, Framer Motion)
│   ├── LandingPage.tsx        # Previous editorial homepage (preserved at /alt)
│   ├── NotFoundPage.tsx       # 404 page
│   ├── auth/
│   │   ├── LoginPage.tsx      # Customer sign-in
│   │   ├── RegisterPage.tsx   # Customer registration
│   │   └── AdminLoginPage.tsx # DMS portal sign-in (dealers/managers/CEO)
│   ├── public/
│   │   ├── AboutPage.tsx      # Company philosophy page
│   │   ├── SupportPage.tsx    # FAQ & support page
│   │   ├── DealershipLocator.tsx # Find-a-dealership map
│   │   └── CarConfigurator.tsx   # Build-your-own vehicle page
│   └── shared/
│       ├── NotificationsPage.tsx # Notifications list
│       ├── ProfilePage.tsx       # User profile
│       └── SettingsPage.tsx      # User settings
│
├── services/                  # Data access layer (mock API functions)
│   ├── authService.ts
│   ├── carService.ts
│   ├── orderService.ts
│   ├── testDriveService.ts
│   ├── inquiryService.ts
│   ├── notificationService.ts
│   └── analyticsService.ts
│
├── types/
│   └── index.ts               # TypeScript interfaces & enums
│
└── utils/
    └── permissions.ts         # hasPermission() utility for RBAC checks
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (Vite HMR)                    │
├──────────────────────────────────────────────────────────┤
│  React Router v6  →  Suspense + React.lazy()             │
│    ├── /           → HomePage (cinematic, standalone)     │
│    ├── /alt        → LandingPage (legacy, standalone)     │
│    ├── /login      → AuthLayout → LoginPage               │
│    └── /*          → MainLayout (TopNav + content + footer)│
│         ├── /cars         → CarBrowser                    │
│         ├── /customer/*   → RoleGuard(CUSTOMER) → …       │
│         ├── /dealer/*     → RoleGuard(DEALER) → …         │
│         ├── /manager/*    → RoleGuard(MANAGER) → …        │
│         └── /ceo/*        → RoleGuard(CEO|ADMIN) → …      │
├──────────────────────────────────────────────────────────┤
│  AuthContext  →  Services (mock API)  →  mockData.ts     │
└──────────────────────────────────────────────────────────┘
```

### Key Patterns

- **Route-level code splitting** — Every dashboard and page is loaded via `React.lazy()` inside a single `<Suspense>` boundary. The browser only downloads code for the pages a user actually visits.
- **Role-based route guards** — `<RoleGuard allowedRoles={[...]}>` wraps each dashboard section. Unauthorised users are redirected to their own dashboard.
- **Service layer abstraction** — All data is fetched through service files (`carService.ts`, `orderService.ts`, etc.) that return `Promise<ApiResponse<T>>`. Currently backed by `mockData.ts`, these can be swapped for real API calls without touching any components.

---

## Routing & Navigation

### Public Routes (no auth required)

| Route                | Page                | Description                              |
|----------------------|---------------------|------------------------------------------|
| `/`                  | `HomePage`          | Cinematic video hero + Serene branding   |
| `/alt`               | `LandingPage`       | Previous editorial homepage              |
| `/login`             | `LoginPage`         | Customer sign-in form                    |
| `/register`          | `RegisterPage`      | Customer registration form               |
| `/admin-login`       | `AdminLoginPage`    | DMS portal login (staff only)            |
| `/cars`              | `CarBrowser`        | Browse all vehicles (filterable grid)    |
| `/cars/:id`          | `CarDetails`        | Vehicle detail page + gallery            |
| `/cars/:id/build`    | `CarConfigurator`   | Build & configure your vehicle           |
| `/about`             | `AboutPage`         | Company philosophy                       |
| `/support`           | `SupportPage`       | FAQ & help centre                        |
| `/dealerships`       | `DealershipLocator` | Find a dealership near you               |

### Customer Routes (requires `CUSTOMER` role)

| Route                   | Page               | Description                  |
|-------------------------|---------------------|------------------------------|
| `/customer`             | `CustomerDashboard` | Welcome hero, stats, featured cars |
| `/customer/test-drives` | `MyTestDrives`      | Upcoming & past test drives  |
| `/customer/orders`      | `MyOrders`          | Order history & tracking     |
| `/customer/inquiries`   | `MyInquiries`       | Inquiry list & status        |

### Dealer Routes (requires `DEALER` role)

| Route                  | Page                 | Description                     |
|------------------------|----------------------|---------------------------------|
| `/dealer`              | `DealerDashboard`    | Sales overview & KPIs           |
| `/dealer/inventory`    | `InventoryManagement`| Manage vehicle stock            |
| `/dealer/inquiries`    | `CustomerInquiries`  | Handle customer inquiries       |
| `/dealer/test-drives`  | `TestDriveSchedule`  | Schedule & manage test drives   |
| `/dealer/sales`        | `SalesProcessing`    | Process & track sales           |

### Manager Routes (requires `MANAGER` role)

| Route                  | Page                   | Description                 |
|------------------------|------------------------|-----------------------------|
| `/manager`             | `ManagerDashboard`     | Team & operations overview  |
| `/manager/team`        | `TeamManagement`       | Manage dealer team members  |
| `/manager/operations`  | `DealershipOperations` | Dealership daily operations |
| `/manager/reports`     | `SalesReports`         | Sales analytics & reports   |

### CEO/Admin Routes (requires `CEO` or `ADMIN` role)

| Route               | Page                   | Description                     |
|----------------------|------------------------|---------------------------------|
| `/ceo`               | `CEODashboard`         | Executive overview & KPIs       |
| `/ceo/dealerships`   | `MultiDealershipView`  | All dealerships at a glance     |
| `/ceo/financials`    | `FinancialAnalytics`   | Revenue, profit, trends         |
| `/ceo/strategy`      | `StrategicPlanning`    | Strategic goals & initiatives   |
| `/ceo/users`         | `UserManagement`       | System-wide user management     |

### Shared Routes (requires any authenticated role)

| Route             | Page                | Description          |
|-------------------|---------------------|----------------------|
| `/notifications`  | `NotificationsPage` | All notifications    |
| `/profile`        | `ProfilePage`       | User profile editor  |
| `/settings`       | `SettingsPage`      | User preferences     |

---

## Role-Based Access Control

The system supports 5 user roles with hierarchical permissions:

```
CEO / Admin
  └── Manager
        └── Dealer
              └── Customer
```

### Roles & Permissions

| Role       | Key Permissions                                                         |
|------------|-------------------------------------------------------------------------|
| `customer` | Browse cars, book test drives, place orders, submit inquiries           |
| `dealer`   | Manage inventory, handle inquiries, schedule test drives, process sales |
| `manager`  | Manage dealers, view reports, oversee dealership operations             |
| `ceo`      | View all dealerships, financial analytics, strategic planning, manage users |
| `admin`    | Same as CEO (full system access)                                        |

### How It Works

1. **`AuthContext`** stores the current user + role after login.
2. **`<RoleGuard allowedRoles={[…]}>`** wraps each route group in `App.tsx`.
3. **`TopNav`** dynamically renders nav items based on `user.role`.
4. **`hasPermission(user, permission)`** is available for fine-grained UI checks.

---

## Pages & Features

### 🎬 Cinematic Homepage (`/`)

- Full-screen **looping video** background with Ken Burns slow-zoom animation
- **Framer Motion** entrance animations (fade + slide) keyed to video loaded state
- Animated **hamburger ↔ X** menu overlay with staggered link animations
- Horizontal **vehicle slider** with snap-scroll and arrow navigation
- Brand values grid, services section, and contact CTA
- Responsive: mobile hamburger drawer, desktop inline nav

### 🏠 Customer Dashboard (`/customer`)

- **Dark hero banner** with personalised welcome and decorative SVG
- **Glassmorphism stat cards** — live counts for orders, test drives, inquiries, saved cars
- **Featured vehicles** grid — real data from `carService`
- **Activity section** — upcoming test drives + recent orders table
- Skeleton loaders during data fetch

### 🚗 Vehicle Showroom (`/cars`)

- Filterable card grid with debounced search
- Lazy-loaded images with Unsplash `&w=600` thumbnail downscaling
- Click-through to full detail page with image gallery

### 📊 Role-Specific Dashboards

Each role dashboard (Dealer, Manager, CEO) follows the same pattern:
- Hero section with key metrics
- Data tables and charts
- Quick-action buttons
- Permission-gated content

---

## Design System

### Typography

| Usage       | Font             | Weight      |
|-------------|------------------|-------------|
| Body text   | Inter            | 300–600     |
| Headings    | Playfair Display | 400 (light) |
| Monospace   | Public Sans      | 400         |

### Custom Colours (via Tailwind)

| Token              | Value                        | Usage                      |
|---------------------|------------------------------|----------------------------|
| `serene-matte`     | `#1a2a44`                    | Primary dark navy          |
| `serene-silver`    | `#f1f0eb`                    | Light backgrounds          |
| `serene-brushed`   | `#c5bfb2`                    | Warm accent / borders      |
| `serene-accent`    | `#2563eb`                    | Interactive highlights      |

### Custom CSS Utilities

| Class           | Effect                                                    |
|-----------------|-----------------------------------------------------------|
| `.glass-card`   | `backdrop-blur-md` + `bg-white/10` + border — glassmorphism |
| `.brushed-border`| Warm serene-brushed coloured border                      |
| `.hover-lift`   | `translateY(-4px)` + subtle shadow on hover               |
| `.animate-kenburns` | Slow 20s scale zoom for video backgrounds             |
| `.scrollbar-hide` | Hides scrollbar on all browsers (for sliders)           |

---

## Performance Optimisations

| Technique                | Implementation                                                     |
|--------------------------|--------------------------------------------------------------------|
| **Code Splitting**       | `React.lazy()` + `<Suspense>` for all dashboard/page components    |
| **Image Lazy Loading**   | `loading="lazy"` on all `<img>` tags in grids                     |
| **Image Downscaling**    | Unsplash `&w=600` for thumbnails, `&w=1200` for detail pages      |
| **Data Caching**         | `@tanstack/react-query` with 5-min stale time, 10-min GC          |
| **Search Debouncing**    | Custom `useDebounce` hook (300ms) on search inputs                 |
| **Dynamic Titles**       | `react-helmet-async` for per-page `<title>` and `<meta>`          |
| **Font Loading**         | Google Fonts `display=swap` for non-blocking font loading          |

---

## Data Layer & Services

All services live in `src/services/` and follow a consistent pattern:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Available Services

| Service                | Key Methods                                                         |
|------------------------|---------------------------------------------------------------------|
| `authService`          | `login()`, `register()`, `getCurrentUser()`                         |
| `carService`           | `getAllCars()`, `getCarById()`, `getFeaturedCars()`, `searchCars()`  |
| `orderService`         | `getCustomerOrders()`, `getOrderById()`, `createOrder()`            |
| `testDriveService`     | `getCustomerTestDrives()`, `scheduleTestDrive()`                    |
| `inquiryService`       | `getCustomerInquiries()`, `submitInquiry()`                         |
| `notificationService`  | `getNotifications()`, `getUnreadCount()`, `markAsRead()`            |
| `analyticsService`     | `getDashboardStats()`, `getSalesData()`, `getRevenueData()`         |

> **Note:** All services currently return data from `src/data/mockData.ts`. To connect to a real backend, replace the function bodies with `fetch()` / `axios` calls — no component changes required.

---

## Configuration

### Tailwind Config (`tailwind.config.js`)

- Custom colour tokens: `serene-matte`, `serene-silver`, `serene-brushed`, `serene-accent`
- Font families: `serif` → Playfair Display, `sans` → Inter
- Extended spacing and border-radius

### Vite Config (`vite.config.ts`)

- Path alias: `@/` → `src/`
- Dev server on port `5173`

### Index HTML (`index.html`)

- Google Fonts preconnect + Inter, Playfair Display, Public Sans
- Google Material Symbols Outlined

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Style

- **TypeScript** strict mode
- **Tailwind CSS** for styling — avoid inline styles
- **React functional components** with hooks
- **Named exports** for components (e.g., `export const MyComponent`)
- **Service layer** for all data access — never import `mockData.ts` in components directly

---

## License

This project is for educational and portfolio demonstration purposes.

---

<p align="center">
  <strong>SERENE</strong> — <em>The Future of Quiet Motion</em>
</p>
