# AMS Setup Guide

Follow these steps to set up AMS from scratch.

## Why Login/Signup?

AMS requires authentication because:
- **Role-based access**: Admins, Managers, and Users have different permissions
- **Data security**: Attendance records and employee data must be protected
- **Accountability**: Track who marked attendance and made changes

## Authentication Options:

1. **Sign Up**: New users can create their own account at `/signup` (gets 'user' role)
2. **Admin Account**: First admin must be created manually (see Step 4)
3. **Role Changes**: Admins can promote users to Manager/Admin in the database

## Step 1: Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Supabase Setup

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose a name (e.g., "ams-db")
4. Choose a region close to you
5. Set a strong database password
6. Wait for project to be created (2-3 minutes)

### Get API Credentials

1. Go to Project Settings > API
2. Copy "Project URL" → paste in `NEXT_PUBLIC_SUPABASE_URL`
3. Copy "anon public" key → paste in `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Run Database Schema

1. Go to SQL Editor in Supabase
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the editor
5. Click "Run"

### Set Up Authentication

1. Go to Authentication > Providers
2. Enable "Email" provider (it should be enabled by default)
3. Click "Save"

### Create Admin User

In Supabase SQL Editor, run:

```sql
-- First, insert into users table
INSERT INTO users (email, full_name, role) VALUES
('admin@ams.com', 'System Administrator', 'admin');

-- Then create the auth user (this will send a confirmation email)
-- You can also use the Supabase dashboard to create the user manually
```

Alternative: Use Supabase Dashboard to create the user:
1. Go to Authentication > Users
2. Click "Add user"
3. Email: admin@ams.com
4. Set a password
5. Click "Save"
6. The user will be created in auth.users
7. You need to manually add the corresponding entry in the public.users table

## Step 3: Add Sample Data (Optional)

In Supabase SQL Editor, run:

```sql
-- Add sample employees
INSERT INTO employees (employee_id, first_name, last_name, email, department, position, hire_date, status) VALUES
('EMP001', 'John', 'Doe', 'john.doe@company.com', 'Engineering', 'Software Engineer', '2024-01-15', 'active'),
('EMP002', 'Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 'Marketing Manager', '2024-02-01', 'active'),
('EMP003', 'Mike', 'Johnson', 'mike.johnson@company.com', 'HR', 'HR Specialist', '2024-03-10', 'active');

-- Add sample attendance (today)
INSERT INTO attendance (employee_id, date, status, check_in_time, marked_by) VALUES
((SELECT id FROM employees WHERE employee_id = 'EMP001'), CURRENT_DATE, 'present', '09:00', (SELECT id FROM users WHERE email = 'admin@ams.com')),
((SELECT id FROM employees WHERE employee_id = 'EMP002'), CURRENT_DATE, 'present', '09:15', (SELECT id FROM users WHERE email = 'admin@ams.com')),
((SELECT id FROM employees WHERE employee_id = 'EMP003'), CURRENT_DATE, 'late', '09:30', (SELECT id FROM users WHERE email = 'admin@ams.com'));
```

## Step 4: Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Login

Use the admin credentials you created:
- Email: admin@ams.com
- Password: (the password you set in Supabase)

## Troubleshooting

### "Invalid login credentials"
- Make sure the user exists in both auth.users AND public.users tables
- Check that the email and password are correct

### "User not found"
- The user exists in auth.users but not in public.users
- Run the INSERT statement to add the user to public.users

### Database connection errors
- Check that your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Make sure Supabase project is not paused

### Middleware errors
- Ensure you have the latest @supabase/ssr package installed
- Check that environment variables are set correctly

## Next Steps

After successful setup:

1. Add more employees via the People page
2. Mark attendance for today
3. View reports and analytics
4. Deploy to Vercel for production use
