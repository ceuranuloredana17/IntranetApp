# TechSoft Intranet

Internal company intranet built with Next.js 16, featuring role-based access control, document management, internal messaging, leave request handling, and task tracking.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Database**: SQLite via `better-sqlite3`
- **Auth**: JWT sessions with `jose`, passwords hashed with `bcryptjs`
- **Styling**: Tailwind CSS v4
- **Runtime**: Node.js 18+

## Features

| Feature | Roles |
|---|---|
| Dashboard with live stats | All |
| User management | Admin |
| Department management | Admin |
| Announcements | Admin, HR, Manager |
| Document upload & approval workflow | All |
| Leave request submission & review | All |
| Task assignment & tracking | Manager, Angajat |
| Internal messaging | All |
| Team overview | Manager |
| Financial reports | Financiar |

## Roles

- **Admin** — full access, user & department management
- **HR** — employee management, leave requests, document approval
- **Manager** — team overview, task assignment, leave approval
- **Financiar** — reports and documents
- **Angajat** — personal tasks, leave requests, documents, messages

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone <repository-url>
cd my-app
npm install
```

### Run in development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

The SQLite database (`intranet.db`) is created automatically on first run and seeded with demo data including 7 users across 5 departments.

### Build for production

```bash
npm run build
npm start
```


## Project Structure

```
my-app/
├── app/
│   ├── actions/          # Server Actions (auth, documents, messages, etc.)
│   ├── dashboard/        # Protected dashboard pages
│   │   ├── anunturi/
│   │   ├── cereri-concediu/
│   │   ├── departamente/
│   │   ├── documente/
│   │   ├── echipa/
│   │   ├── mesaje/
│   │   ├── rapoarte/
│   │   ├── taskuri/
│   │   ├── utilizatori/
│   │   ├── layout.js
│   │   └── page.js
│   ├── login/
│   └── globals.css
├── components/
│   ├── Sidebar.js
│   └── TopBar.js
├── lib/
│   ├── auth.js           # JWT session helpers
│   └── db.js             # SQLite schema, seed data
└── proxy.js              # Route protection middleware
```

## Database Schema

Seven tables with foreign key relationships:

- `departments` — company departments
- `users` — employee accounts (FK → departments)
- `announcements` — company-wide notices (FK → users)
- `documents` — files with approval workflow: draft → pending → approved (FK → users)
- `leave_requests` — employee leave submissions with review status (FK → users)
- `tasks` — work items assigned between users (FK → users)
- `messages` — internal direct messages (FK → users)

## Document Approval Workflow

1. Any user uploads a document (saved as **draft**)
2. Owner submits it for review → status becomes **pending**
3. Admin / HR / Manager reviews it → **approved** or rejected back to **draft**

Only approved documents are visible to all employees.

## Environment Variables

No `.env` file is required for development. For production, set the following:

```env
JWT_SECRET=your-secure-random-secret-here
```

By default the app uses a hardcoded development secret — replace it before going live.

## License

Private project — TechSoft Solutions SRL © 2026
