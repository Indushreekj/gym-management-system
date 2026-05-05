# Advanced Gym Management System

A full-stack, scalable Gym Management System built with a modern architecture. This monorepo contains a Next.js frontend and an Express/Node.js backend, powered by PostgreSQL and Prisma.

## Tech Stack

*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Recharts, Lucide React
*   **Backend**: Node.js (Express), TypeScript, Prisma ORM
*   **Database**: PostgreSQL
*   **Real-time**: Socket.io (for live attendance tracking)
*   **Authentication**: JWT & Role-Based Access Control (Admin, Trainer, Member)
*   **Architecture**: Monorepo with npm workspaces

## Features

1.  **Role-Based Dashboards**: Tailored views for Admins, Trainers, and Members.
2.  **Authentication**: Secure login and registration using bcrypt and JWT.
3.  **Membership Management**: Handling different plans and simulated payment success.
4.  **Real-Time Attendance**: Live updates to Admin and Trainer dashboards when a member checks in using Socket.io.
5.  **AI Recommendations**: Personalized fitness and diet suggestions based on user goals and BMI.
6.  **Analytics**: Revenue, user growth, and active membership statistics powered by Recharts.

## Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   PostgreSQL
*   Docker & Docker Compose (optional, for easy database setup)

### Installation

1.  Clone the repository and install dependencies from the root directory:
    ```bash
    npm install
    ```

2.  Start the local database using Docker Compose (or configure your own PostgreSQL instance):
    ```bash
    docker-compose up -d
    ```

3.  Configure Environment Variables:
    *   Create a `.env` file in `apps/backend/` and set your `DATABASE_URL` and `JWT_SECRET`.
    *   Create a `.env.local` file in `apps/frontend/` if you need to configure the `NEXT_PUBLIC_API_URL`.

4.  Run Database Migrations:
    ```bash
    cd apps/backend
    npx prisma migrate dev --name init
    npx prisma generate
    cd ../..
    ```

### Running the Application

You can start both the frontend and backend servers concurrently from the root directory:

```bash
npm run dev
```

Alternatively, you can run them individually:

*   **Frontend**: `npm run dev:frontend` (Runs on http://localhost:3000)
*   **Backend**: `npm run dev:backend` (Runs on http://localhost:5000)

## Project Structure

```
gym-management-system/
├── apps/
│   ├── backend/       # Express.js REST API
│   └── frontend/      # Next.js Web Application
├── docker-compose.yml # PostgreSQL & Redis configuration
├── package.json       # Monorepo workspace configuration
└── README.md
```
