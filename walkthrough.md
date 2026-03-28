# Serene Motors — Complete Architecture and Progress Walkthrough

Welcome! This document outlines everything we designed, built, structured, and troubleshot for the **Serene Motors Dealership Management System (DMS) and Luxury Landing Page**. 

Whether you're developing the frontend UI, extending the backend API, or managing the database, this is the A-to-Z playbook of the current architecture.

---

## 🏛️ High-Level Architecture
Serene Motors uses a **decoupled, stateless client-server model**:
- **Frontend Layer:** A high-performance, cinematic Single Page Application (SPA) built with React, Vite, and Tailwind CSS.
- **Backend Layer:** A robust Spring Boot 3.3.6 REST API running on Java (targeting Java 21 bytecode for tool support, deploying on Java 25).
- **Data Layer:** A relational MariaDB 11.4 database utilizing JPA/Hibernate ORM for data persistence and relationship mapping.

> **Project Paths:**
> - **Frontend:** `C:\Users\Gautam\Desktop\My\Project\Serene\Frontend`
> - **Backend:** `C:\Users\Gautam\Desktop\My\Project\Serene\Backend`

---

## 🖥️ Frontend (React / Vite)
The UI is divided into two primary experiences:
1. **Public Showcase:** Highly visual pages (Home, Cars, About) focused on luxury marketing.
2. **Dealership Management System (DMS):** A protected portal (`/employee`, `/dealer`, `/admin`) to manage inventory, inquiries, test drives, and internal analytics.

### Tech Stack & Libraries
- **Core Builder:** Vite + React 19 (TypeScript)
- **Styling UI:** Tailwind CSS v3, `shadcn/ui`, Radix UI Primitives (Accordion, Dialog, Tabs, Selects).
- **Animation:** Framer Motion (page transitions, micro-interactions).
- **Icons & Visualization:** Lucide-React for crisp SVG icons, Recharts for dashboard analytics.
- **State & Forms:** `react-hook-form` with `zod` for rigorous client-side validation, React Query for server state (planned integration).

---

## ⚙️ Backend (Spring Boot REST API)
The backend is a monolithic Spring application enforcing strict role-based access control, transaction boundaries, and a unified response format across all 60+ endpoints.

### Tech Stack & Configuration
- **Core:** Spring Boot 3.3.6
- **Database Connection:** MariaDB JDBC Driver + HikariCP Connection Pool
- **Object Relational Mapping (ORM):** Spring Data JPA (Hibernate)
- **Security:** Spring Security with JSON Web Tokens (JWT) for stateless sessions.
- **Boilerplate Reduction:** Lombok `1.18.38`
- **API Documentation:** OpenAPI (Swagger UI) version `2.5.0`

### 1. Data Models (Entities & Enums)
The schema tracks 10 inter-connected core entities:
*   `User`: Represents Admins, Managers, Dealers, Employees, and Customers.
*   `Dealership`: Physical locations representing inventory nodes.
*   `Car`: Vehicles matched to Dealerships, tracking status (Available, Sold, Maintenance).
*   `Inquiry` & `TestDrive`: Customer touchpoints mapped to Cars, Users, and assigned Dealers.
*   `Order`, `FinancingOption`, `Document`: Sales pipeline artifacts mapping closing statuses, payments, and generated reports.
*   `Notification`: User-targeted alerts stored as JSON structures.
*   `RefreshToken`: Database-backed tokens for secure, single-use JWT rotations.

**9 Core Enums enforce state constraints:** `UserRole`, `UserStatus`, `CarCategory`, `CarStatus`, `InquiryStatus`, `TestDriveStatus`, `OrderStatus`, `PaymentStatus`, `NotificationType`.

### 2. Controller & Service Layer Architecture
All traffic funnels through 8 mapped REST controllers:
*   `/api/v1/auth`: Authentication (`/login`, `/register`, `/refresh`, `/me`).
*   `/api/v1/cars`: Inventory queries with robust, dynamic filtering (`JpaSpecificationExecutor`).
*   `/api/v1/inquiries`: Client questions and dealer interactions.
*   `/api/v1/test-drives`: Calendar appointments and statuses.
*   `/api/v1/orders`: Financial transactions and tracking.
*   `/api/v1/dealerships`: Branch management (Admin access).
*   `/api/v1/users`: CRM overview of platform members.
*   `/api/v1/analytics`: Aggregate statistics (Sales, Revenue, Dashboard KPIs).

### 3. Unified Responses & Exception Handling
Every request returns a strictly typed `ApiResponse` body:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "errors": null
}
```
A `@RestControllerAdvice` (`GlobalExceptionHandler`) catches standard exceptions (e.g., `404 ResourceNotFound`, `400 BadRequest`, `409 DuplicateResource`, Form Validations) and wraps them inside `ApiResponse.error()` payloads to simplify frontend parsing.

### 4. Database Seeding
The backend includes a `DataLoader` class that automatically populates the MariaDB database upon the first boot if the tables are empty. It seeds:
- 2 Active Dealerships (Mumbai & Delhi).
- 5 Users covering every role (`admin`, `manager`, `dealer`, `employee`, `customer`).
- 6 Luxury vehicles matching diverse categories (SUV, Sedan, Electric).
- *All passwords default to `password123` via BCrypt.*

---

## 🛠️ Build & Troubleshooting Fixes Applied
During local compilation and dependency setup, we resolved three critical Java pipeline blockers:

1. **Lombok `@Getter`/`@Setter` Compatibility:**
   *  **The Error:** Using Java 25 caused Lombok 1.18.36 to crash compiler plugins (`TypeTag::UNKNOWN` exceptions inside internal `javac` APIs).
   *  **The Fix:** Upgraded Lombok to `1.18.38` (which includes Java 25 support) and explicitly set the `maven-compiler-plugin` `<release>21</release>` target to guarantee bytecode stability while still allowing the system to run on the Java 25 JVM.
2. **Spring Boot `LiteWebJarsResourceResolver` Crash:**
   *  **The Error:** `springdoc-openapi 2.7.0` forcefully requested a class introduced in Spring 6.2 (Spring Boot 3.4+). We are using Spring Boot 3.3.6 (Spring 6.1).
   *  **The Fix:** Downgraded the OpenAPI dependency to `2.5.0` to match our established Spring framework version.
3. **Database Credentials:**
   *  **The Fix:** Updated `application.yml` MariaDB pool authentication from default `root/root` to securely connect to the local daemon using `password: 1234`.

---

## 🚀 How to Launch the Application

The usual setup is **locally installed MariaDB** plus **Java + Maven** on your machine. You do not need Docker for day-to-day development.

### 1. Start MariaDB (local install)
Ensure the MariaDB service is running (Windows Services, or your OS equivalent).
- **Host:** `localhost`
- **Port:** `3306`
- **Username:** `root`
- **Password:** `1234` (must match `spring.datasource` in `Backend/src/main/resources/application.yml`)

The JDBC URL uses `createDatabaseIfNotExist=true`, so the `serene_dms` database is created on first connection if it does not exist.

**Optional — Docker:** If you prefer a container instead of a local daemon, `Backend/docker-compose.yml` can start MariaDB 11.4 with the same credentials; it is not required when MariaDB is already installed locally.

### 2. Start the Spring Boot API
Use a JDK compatible with the project (Java 21 bytecode; Java 21+ runtime is fine) and **Apache Maven on your `PATH`** (`mvn -v` should work in a terminal).

From the `Backend` folder:

```bash
cd "C:\Users\Gautam\Desktop\My\Project\Serene\Backend"
mvn spring-boot:run
```

To compile or build a runnable JAR without starting the dev server:

```bash
mvn -DskipTests compile
mvn -DskipTests package
java -jar target/serene-dms-1.0.0.jar
```

- **Base URL:** `http://localhost:8080/api/v1`
- **Swagger UI:** `http://localhost:8080/api/v1/swagger-ui.html`
- **Health:** `http://localhost:8080/api/v1/actuator/health`

### 3. Start the Vite React SPA
Open a second terminal in the `Frontend` directory:

```bash
cd "C:\Users\Gautam\Desktop\My\Project\Serene\Frontend"
npm run dev
```

- **Web App URL:** `http://localhost:5173`
- **API base URL:** `Frontend/.env.development` sets `VITE_API_BASE_URL=http://localhost:8080/api/v1` so the SPA talks to the Spring API on port 8080.

> **Note on Testing:** The backend auto-generates tables and seed data (`ddl-auto: update` and `DataLoader` when tables are empty). Use `admin@serene.com` / `password123` for full DMS access, or `gautam@serene.com` / `password123` for the seeded customer account.
