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

7. Backend now has automated regression tests.
- Added unit tests for authentication flows (register, refresh token expiry, password change guard, profile update behavior).
- Added unit tests for analytics behavior (revenue null fallback and marketing channel grouping).
- Evidence: [Backend/src/test/java/com/serene/dms/service/AuthServiceTest.java](Backend/src/test/java/com/serene/dms/service/AuthServiceTest.java)
- Evidence: [Backend/src/test/java/com/serene/dms/service/AnalyticsServiceTest.java](Backend/src/test/java/com/serene/dms/service/AnalyticsServiceTest.java)

8. Backend security and validation were hardened.
- `/auth/me` update endpoints now use validated DTOs instead of untyped maps to avoid invalid payloads reaching business logic.
- Password changes now reject reusing the current password.
- Seeder endpoint access is now admin-only and no longer publicly exposed.
- Evidence: [Backend/src/main/java/com/serene/dms/controller/AuthController.java](Backend/src/main/java/com/serene/dms/controller/AuthController.java)
- Evidence: [Backend/src/main/java/com/serene/dms/dto/request/UpdateProfileRequest.java](Backend/src/main/java/com/serene/dms/dto/request/UpdateProfileRequest.java)
- Evidence: [Backend/src/main/java/com/serene/dms/dto/request/ChangePasswordRequest.java](Backend/src/main/java/com/serene/dms/dto/request/ChangePasswordRequest.java)
- Evidence: [Backend/src/main/java/com/serene/dms/service/AuthService.java](Backend/src/main/java/com/serene/dms/service/AuthService.java)
- Evidence: [Backend/src/main/java/com/serene/dms/config/SecurityConfig.java](Backend/src/main/java/com/serene/dms/config/SecurityConfig.java)
- Evidence: [Backend/src/main/java/com/serene/dms/controller/SeederController.java](Backend/src/main/java/com/serene/dms/controller/SeederController.java)

9. Sensitive runtime values are now environment-overridable.
- MariaDB credentials, JWT secret, JPA DDL mode, and app log level can now be configured by environment variables.
- Evidence: [Backend/src/main/resources/application.yml](Backend/src/main/resources/application.yml)

## Remaining

1. Non-blocking frontend optimization remains.
- Production build completes successfully, but Vite still warns about large chunks that could be split further.

2. Non-blocking polish remains in a few legacy UI files.
- Some decorative/legacy text artifacts outside core customer flow can still be cleaned incrementally.

## Verification Snapshot

1. Frontend build is passing (`npm run build`).
2. Backend clean compile is passing (`mvn clean compile -DskipTests`).
3. Backend unit tests are passing (`mvn clean test`, 7 tests).
4. Functional blocker count from this pass: 0.
