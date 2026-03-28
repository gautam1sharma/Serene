# Frontend Engineer Request — Dealer Portal Remaining Work

This document describes the remaining UI/frontend tasks for the **Serene Motors DMS Dealer Portal** that require a frontend engineer. All backend APIs are live and ready. The project uses **React + TypeScript + Tailwind CSS** with a custom `dealer-*` design token system.

---

## Project Context

- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, `sonner` for toasts, Lucide icons
- **API base:** `http://localhost:8080/api/v1` (configured via `VITE_API_BASE_URL`)
- **Auth:** JWT stored in `localStorage` as `serene_auth_token`. Use `useAuth()` from `@/contexts/AuthContext` to get the current `user` object.
- **API helper:** Use `apiRequest<T>(path, options)` from `@/lib/api.ts` for all fetches — it handles auth headers automatically.
- **Design tokens:** Use `dealer-primary`, `dealer-on-surface`, `dealer-surface-container-lowest`, etc. (Material 3 inspired). Match the existing style in `DealerDashboard.tsx` and `CustomerInquiries.tsx`.

---

## Task 1 — `EmployeeAssignments.tsx` (Currently 100% Static)

**Route:** `/dealer/assignments`

The page currently renders hardcoded employee cards (names like "Marcus Holloway"). Replace it with a **live employee assignment board**.

### What to build:
A two-column layout:
- **Left column:** List of EMPLOYEE-role users fetched from `GET /api/v1/users?role=EMPLOYEE&limit=20`. Show avatar initials, name, role badge, and status dot.
- **Right column:** List of open inquiries (`GET /api/v1/inquiries?status=pending&limit=50`) with an **"Assign to employee"** dropdown per inquiry. On selection, call `PATCH /api/v1/inquiries/{id}/assign` with body `{ "dealerId": number }`.

### API endpoints:
```
GET  /api/v1/users?role=EMPLOYEE&limit=20       → list of employees
GET  /api/v1/inquiries?status=pending&limit=50  → open inquiries
PATCH /api/v1/inquiries/{id}/assign             → body: { "dealerId": userId }
```

### Notes:
- Show a loading skeleton while fetching.
- Show a toast (`sonner`) on success/error.
- The assign dropdown should show employee names. Filter only `status: 'ACTIVE'` employees.
- After assigning, refresh the inquiry list.

---

## Task 2 — `EmployeePerformance.tsx` (Currently 100% Static)

**Route:** `/dealer/performance`

The page currently renders hardcoded bars and conversion rates. Replace it with **real performance data**.

### What to build:
A dashboard showing:
1. **KPI cards** (reuse the card style from `DealerDashboard.tsx`):
   - Total Inquiries Handled (filter `assignedDealerId = user.id`)
   - Closed Inquiries (status = `closed`)
   - Conversion Rate (closed / total × 100)
   - Upcoming Test Drives assigned to this dealer

2. **Staff leaderboard table** — fetch all dealers/employees and rank by number of closed inquiries. Columns: Rank, Name, Closed Deals, Conversion %.

### API endpoints:
```
GET /api/v1/inquiries?assignedDealerId={userId}&limit=200   → inquiries for this dealer
GET /api/v1/test-drives?dealerId={userId}&limit=50          → test drives for this dealer
GET /api/v1/users?role=EMPLOYEE&limit=50                    → for leaderboard
```

### Notes:
- For the leaderboard, you will need to fetch inquiries for each employee and count closed ones client-side (or show a simplified version with total inquiries count per employee from the `assignedDealerId` filter).
- Use the `useAuth()` hook to get `user.id` for the logged-in dealer.

---

## Task 3 — `InventoryManagement.tsx` — Wire "Add New Vehicle" Button

**File:** `Frontend/src/dashboards/dealer/InventoryManagement.tsx`

The "Add New Vehicle" button (line ~129) currently has no `onClick`. Build a **modal or slide-over panel** to create a new vehicle.

### Form fields required:
| Field | Type | Notes |
|---|---|---|
| `model` | text | Required |
| `year` | number | 2018–2026 |
| `category` | select | `suv`, `sedan`, `hatchback`, `luxury`, `electric`, `hybrid` |
| `price` | number | In INR |
| `color` | text | |
| `vin` | text | 17-char alphanumeric |
| `engine` | text | |
| `transmission` | select | `Manual`, `Automatic` |
| `fuelType` | select | `petrol`, `diesel`, `electric`, `hybrid` |
| `description` | textarea | |
| `dealershipId` | hidden | Auto-populated from `user.dealershipId` |

### API endpoint:
```
POST /api/v1/cars
Body: { model, year, category, price, color, vin, engine, transmission, fuelType, description, dealershipId }
```

### Notes:
- On success: close modal, add the new car to the top of the list, show a toast.
- Validate required fields (`model`, `year`, `category`, `price`, `vin`) before submitting.
- Use the same card/modal style as the existing edit modal in `InventoryManagement.tsx` (see `editingCar` modal).

---

## Task 4 — `CustomerInquiries.tsx` — Fix "Assign Employee" Dropdown

**File:** `Frontend/src/dashboards/dealer/CustomerInquiries.tsx`

The modal's "Assign Employee" dropdown (search for `"Robert Sterling"`) currently has hardcoded placeholder names. Replace it with a live employee fetch.

### What to fix:
1. Add a `useEffect` to fetch `GET /api/v1/users?role=EMPLOYEE&limit=50` when the modal opens.
2. Populate the `<select>` or a searchable dropdown with the fetched names.
3. On selecting an employee and clicking "Save Changes", call `PATCH /api/v1/inquiries/{id}/assign` with `{ "dealerId": selectedEmployeeId }`.
4. The "Active" status toggle button has an empty `onClick` — wire it to call `PATCH /api/v1/inquiries/{id}/status` with `{ "status": "responded" }` or `"pending"` depending on current state.

### API endpoints:
```
GET   /api/v1/users?role=EMPLOYEE&limit=50     → employee list for dropdown
PATCH /api/v1/inquiries/{id}/assign            → body: { "dealerId": number }
PATCH /api/v1/inquiries/{id}/status            → body: { "status": "responded"|"pending"|"closed" }
```

---

## Task 5 — `SalesProcessing.tsx` — Fix Hardcoded Growth Badge

**File:** `Frontend/src/dashboards/dealer/SalesProcessing.tsx`

The `+12.5%` badge (line ~115) is hardcoded. Replace it with a computed value.

### What to fix:
Call `GET /api/v1/analytics/sales-report` and compare `totalRevenue` to the previous period. For a simpler implementation, fetch `GET /api/v1/analytics/dashboard` and use `monthlyGrowth` to populate the badge dynamically.

```
GET /api/v1/analytics/dashboard   → { monthlyGrowth: number, ... }
```

The badge already exists — just replace the hardcoded `"+12.5%"` string with `\`+${metrics?.monthlyGrowth ?? 12.5}%\``.

---

## General Notes for All Tasks

- Match the existing design language exactly — use `dealer-*` color tokens, `rounded-2xl`/`rounded-3xl` card radius, `shadow-sm` for cards.
- All data fetches should show a loading skeleton (`animate-pulse bg-slate-200 rounded-lg`) while pending.
- Show error states with a retry button if the API call fails.
- All buttons should have `active:scale-95 transition-all` for touch feedback.
- Use `sonner`'s `toast.success()` / `toast.error()` for user feedback.
- Refer to `CustomerInquiries.tsx` for the modal pattern and `DealerDashboard.tsx` for the card/table pattern.
