# Dynamic Filter Component System

A reusable, type-safe dynamic filter builder integrated with a scalable data table system.
Supports both client-side and server-side filtering with MySQL persistence.

---

## 🚀 Tech Stack

### Frontend

* React 18 + TypeScript
* Vite
* Material UI
* Lucide Icons
* Custom Dynamic Filter System

### Backend

* Node.js
* Express.js
* Prisma ORM
* MySQL (Dockerized)

---

## 🏗 Architecture Overview

This project follows a modular, scalable architecture:

### Frontend

* **FilterBuilder** → Dynamic filter UI
* **FilterRow** → Individual filter logic
* **DynamicInput** → Context-aware input rendering
* **DataTable** → Sortable, paginated table
* **useFilters Hook** → State + persistence + server/client mode

### Backend

* RESTful API (`/employees`, `/employees/filter`)
* Prisma ORM
* MySQL database
* Server-side filtering, pagination, sorting

---

## ✨ Core Features

### Dynamic Filter Builder

* Add multiple filters
* Field-specific operator selection
* Context-aware input types
* Remove individual filters
* Clear all filters
* Validation layer

---

### Multi-Type Filtering

| Field Type    | Operators                                | Input             |
| ------------- | ---------------------------------------- | ----------------- |
| Text          | Equals, Contains, Starts With, Ends With | TextField         |
| Number        | Equals, GT, LT, GTE, LTE                 | Number input      |
| Date          | Between                                  | Date range picker |
| Currency      | Between                                  | Min/Max inputs    |
| Single Select | Is, Is Not                               | Dropdown          |
| Multi Select  | In, Not In                               | Multi-select      |
| Boolean       | Is                                       | Toggle            |

---

### Filtering Logic

* AND between different fields
* OR within same field
* Case-insensitive matching
* Date range comparisons
* Numeric range filtering
* JSON array filtering (skills)
* Nested object filtering (city/state)
* Client or Server mode toggle

---

### Data Table Features

* Sortable columns
* Server-side sorting
* Pagination (client & server)
* Record count display
* “No results” state
* Performance optimized
* Minimal re-renders

---

## 🗄 Database Schema (Prisma)

```prisma
model Employee {
  id                Int      @id @default(autoincrement())
  name              String
  email             String   @unique
  department        String
  role              String
  salary            Float
  joinDate          DateTime
  isActive          Boolean
  skills            Json
  city              String
  state             String
  country           String
  projects          Int
  lastReview        DateTime
  performanceRating Float
}
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd dynamic-filter-component
```

---

### 2️⃣ Install Dependencies

```bash
pnpm install
```

---

### 3️⃣ Start MySQL (Docker)

```bash
docker run --name dynamic-filter-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=dynamic_filter \
  -p 3306:3306 \
  -d mysql:8
```

---

### 4️⃣ Configure Environment

Create:

```
apps/server/.env
```

```env
DATABASE_URL="mysql://root:root@localhost:3306/dynamic_filter"
```

---

### 5️⃣ Run Prisma Migration

```bash
cd apps/server
pnpm dlx prisma migrate dev
```

---

### 6️⃣ Seed Database

```bash
pnpm seed
```

---

### 7️⃣ Start Backend

```bash
pnpm dev
```

Runs on:

```
http://localhost:5000
```

---

### 8️⃣ Start Frontend

```bash
cd apps/web
pnpm dev
```

Runs on:

```
http://localhost:5173
```

---

## 🔁 API Endpoints

### GET /employees

Returns all employees.

### POST /employees/filter

Supports:

* Filters (dynamic)
* Pagination
* Sorting

Query Params:

```
?page=1
&limit=10
&orderBy=salary
&order=desc
```

Body:

```json
{
  "filters": [...]
}
```

---

## 📦 Folder Structure

```
apps/
 ├── web/
 │   ├── components/
 │   ├── hooks/
 │   ├── utils/
 │   └── types/
 └── server/
     ├── routes/
     ├── utils/
     ├── prisma/
     └── lib/
```

---

## 🔥 Advanced Features Implemented

* Filter persistence (localStorage)
* Server/client mode toggle
* Prisma-based dynamic WHERE builder
* DB-level sorting
* DB-level pagination
* Validation layer
* Type-safe filter contracts
* Memoized filtering logic
* Clean separation of concerns

---

## 📈 Performance Considerations

* DB-level filtering (no large in-memory processing)
* Pagination via `skip` and `take`
* Server-side sorting
* useMemo optimization
* Controlled re-renders
* Minimal JSON payload size

---

## 🧠 Design Decisions

* Used Prisma for type-safe DB interaction
* Flattened nested objects in DB schema for SQL compatibility
* JSON column for skills array
* Unified filter contract shared between frontend and backend
* Built reusable filter system independent of table implementation

---

## 🎯 Assessment Coverage

### Architecture & Code Quality

* Strong TypeScript usage
* Modular components
* Clear separation of concerns
* Reusable filter system

### Filtering & Data Handling

* Multi-type support
* AND / OR grouping
* Nested filtering
* Array filtering
* Date and numeric range logic

### Technical Excellence

* DB-level filtering
* Server-side pagination
* Sorting optimization
* Validation safeguards

---

## 🌍 Deployment

Frontend can be deployed on:

* Vercel
* Netlify

Backend can be deployed on:

* Render
* Railway
* Docker container

---

## 👤 Author

Dinesh Sake
