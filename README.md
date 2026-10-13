# AMS - Attendance Management System

A modern attendance management system built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication**: Sign up and login with role-based access control
- **Dashboard**: Overview of attendance metrics, quick stats, and recent activity
- **People Management**: Add, edit, and manage employees with role-based access
- **Attendance Recording**: Manual attendance marking by admins and managers
- **Reports**: Monthly attendance summaries with CSV export functionality
- **Role-Based Access**: Admin, Manager, and User roles with different permissions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Authentication

- **Sign Up**: New users can create accounts at `/signup` (default role: user)
- **Login**: Existing users sign in at `/login`
- **Roles**:
  - **Admin**: Full access to all features
  - **Manager**: Can manage employees and mark attendance
  - **User**: Can view their own attendance and reports

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (server-side React)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel (with GitHub auto-deploy)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ams
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy and paste the contents of supabase-schema.sql into your Supabase SQL Editor
```

### 5. Set up authentication

1. In Supabase, go to Authentication > Providers
2. Enable Email provider
3. Create an admin user in the `users` table (run this in SQL Editor):

```sql
INSERT INTO users (email, full_name, role) VALUES
('admin@ams.com', 'System Administrator', 'admin');
```

4. Then create a user in Supabase Auth with the same email and set a password

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ams/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── people/       # Employee management
│   │   ├── attendance/   # Attendance marking
│   │   ├── reports/      # Reports and analytics
│   │   └── login/        # Login page
│   ├── components/       # React components
│   │   ├── layout/       # Layout components (Sidebar, Header)
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # Utility functions (Supabase client)
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── supabase-schema.sql   # Database schema
```

## User Roles

### Admin
- Full access to all features
- Can manage users, employees, and attendance
- Can view all reports

### Manager
- Can manage employees
- Can mark attendance
- Can view reports
- Cannot manage users

### User
- Can only view their own attendance
- Can view reports
- Cannot manage employees or mark attendance

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically deploy on every push to your main branch.

## Database Schema

The application uses the following tables:

- `users`: System users for authentication
- `employees`: Employee information
- `attendance`: Daily attendance records

See `supabase-schema.sql` for the complete schema including RLS policies.

## License

MIT
