# Dealer Page Shortcomings & Required Fixes

This document tracks the final remaining tasks for the Dealer management system. Most major logic gaps (dynamic data, seeding, and assignments) have been resolved.

## 1. Static UI & UX Polishing
- **Dead "Add New Vehicle" Button**:
  - `InventoryManagement.tsx` (line 128): The button is visually complete but lacks an `onClick` handler. It should trigger the `setEditingCar` state with a template for a new vehicle.
- **Sparkline Trends**:
  - `DealerDashboard.tsx`: KPI sparklines (lines 52, 57, 67) are still static SVG paths. For a true dynamic feel, these should be generated from real historical data points if available in the backend.
- **Marketing ROI / Distribution Charts**:
  - `EmployeePerformance.tsx`: The "Conversion Distribution" chart (lines 354-388) is currently a UI-only representation with hardcoded width percentages (`width: '33%'`, etc.). This should be calculated from the `leaderboard` state.

## 2. API / Logic Edge Cases
- **Pagination Sync**:
  - `InventoryManagement.tsx`: Improving the sync between the local `total` count and the backend `inventoryStatus` analytics counting.

## 3. Completed / Resolved (NEW)
- [x] **Dynamic Employee Assignment**: `/dealer/assignments` is now fully dynamic, fetching active employees and allowing real-time assignment of inquiries.
- [x] **Dynamic Performance Dashboard**: `/dealer/performance` now shows real KPIs for the logged-in user and a live staff leaderboard ranked by closed deals.
- [x] **Hardcoded Dealer IDs Removed**: `CustomerInquiries.tsx`, `TestDriveSchedule.tsx`, and `EmployeePerformance.tsx` now correctly use `user.id` from `AuthContext` instead of hardcoded `1`.
- [x] **Functional Inquiry Management**: Modals now support real-time employee assignment and status updates (Active/Pending/Closed).
- [x] **Test Drive Management**: Status transitions (Confirm/Complete/Cancel) are now functional in the Test Drive schedule view.
