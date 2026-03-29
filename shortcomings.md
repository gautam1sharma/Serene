# Project Shortcomings Audit (Current Remaining)

Date: 2026-03-29
Scope: Frontend + Backend completion pass.

## Completed In This Pass

1. Customer route mismatch is resolved and verified.
- Evidence: [Frontend/src/App.tsx](Frontend/src/App.tsx)
- Evidence: [Frontend/src/dashboards/customer/MyOrders.tsx](Frontend/src/dashboards/customer/MyOrders.tsx)
- Evidence: [Frontend/src/dashboards/customer/MyInquiries.tsx](Frontend/src/dashboards/customer/MyInquiries.tsx)
- Evidence: [Frontend/src/dashboards/customer/MyTestDrives.tsx](Frontend/src/dashboards/customer/MyTestDrives.tsx)

2. Notification UX is fully wired in the main layout header.
- Top navigation now loads recent notifications, unread count, and supports mark-as-read and mark-all-read.
- Evidence: [Frontend/src/components/layout/TopNav.tsx](Frontend/src/components/layout/TopNav.tsx)

3. Service-layer data scoping was tightened to avoid unnecessary over-fetch.
- Inquiry list and pending APIs now forward dealership filters from frontend.
- Recent orders calls now support dealership-scoped requests where available.
- Dealer and manager dashboard calls now pass dealership scope consistently.
- Evidence: [Frontend/src/services/inquiryService.ts](Frontend/src/services/inquiryService.ts)
- Evidence: [Frontend/src/services/orderService.ts](Frontend/src/services/orderService.ts)
- Evidence: [Frontend/src/services/analyticsService.ts](Frontend/src/services/analyticsService.ts)
- Evidence: [Frontend/src/dashboards/dealer/DealerDashboard.tsx](Frontend/src/dashboards/dealer/DealerDashboard.tsx)
- Evidence: [Frontend/src/dashboards/dealer/SalesProcessing.tsx](Frontend/src/dashboards/dealer/SalesProcessing.tsx)
- Evidence: [Frontend/src/dashboards/manager/ManagerDashboard.tsx](Frontend/src/dashboards/manager/ManagerDashboard.tsx)

4. Placeholder actions from previously flagged dashboards were replaced with concrete operations.
- Sales processing table action now exports per-order CSV snapshots.
- Manager dashboard transaction CTA now routes to reports.
- User management actions now support detail preview and copy-email.
- Evidence: [Frontend/src/dashboards/dealer/SalesProcessing.tsx](Frontend/src/dashboards/dealer/SalesProcessing.tsx)
- Evidence: [Frontend/src/dashboards/manager/ManagerDashboard.tsx](Frontend/src/dashboards/manager/ManagerDashboard.tsx)
- Evidence: [Frontend/src/dashboards/admin/UserManagement.tsx](Frontend/src/dashboards/admin/UserManagement.tsx)

5. Customer dashboard text artifacts were cleaned in section labels.
- Evidence: [Frontend/src/dashboards/customer/CustomerDashboard.tsx](Frontend/src/dashboards/customer/CustomerDashboard.tsx)

6. Backend compile blocker is resolved.
- Removed duplicate `getMarketingROI` method causing compiler failure.
- Backend now compiles successfully with `mvn clean compile -DskipTests`.
- Evidence: [Backend/src/main/java/com/serene/dms/service/AnalyticsService.java](Backend/src/main/java/com/serene/dms/service/AnalyticsService.java)

## Remaining

1. Backend still has no automated tests (`mvn test` reports no tests to run), so regression protection is still manual.

2. Non-blocking frontend optimization remains.
- Production build completes successfully, but Vite still warns about large chunks that could be split further.

3. Non-blocking polish remains in a few legacy UI files.
- Some decorative/legacy text artifacts outside core customer flow can still be cleaned incrementally.

## Verification Snapshot

1. Frontend build is passing (`npm run build`).
2. Backend clean compile is passing (`mvn clean compile -DskipTests`).
3. Functional blocker count from this pass: 0.
