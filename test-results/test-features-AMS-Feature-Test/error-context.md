# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-features.spec.ts >> AMS Feature Test
- Location: test-features.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/people" until "load"
  navigated to "https://ams-ame-a6d5.vercel.app/dashboard"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - heading "AMS" [level=1] [ref=e7]
          - paragraph [ref=e8]: Attendance Management System
        - navigation [ref=e9]:
          - link "Dashboard" [ref=e10] [cursor=pointer]:
            - /url: /dashboard
          - link "People" [active] [ref=e17] [cursor=pointer]:
            - /url: /people
          - link "Attendance" [ref=e24] [cursor=pointer]:
            - /url: /attendance
          - link "Reports" [ref=e30] [cursor=pointer]:
            - /url: /reports
        - generic [ref=e35]:
          - paragraph [ref=e36]: admin
          - paragraph [ref=e37]: Logged in
    - generic [ref=e38]:
      - banner [ref=e39]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - heading "Dashboard" [level=1] [ref=e44]
            - paragraph [ref=e45]: Overview of attendance metrics
          - button [ref=e47] [cursor=pointer]
      - main [ref=e51]:
        - generic [ref=e52]: v2-fix-2026-10-26
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: "+2"
            - heading "7" [level=3] [ref=e66]
            - paragraph [ref=e67]: Total Employees
            - paragraph [ref=e68]: this month
          - generic [ref=e69]:
            - generic [ref=e70]: "+5"
            - heading "7" [level=3] [ref=e78]
            - paragraph [ref=e79]: Expected Today
            - paragraph [ref=e80]: from yesterday
          - generic [ref=e81]:
            - generic [ref=e82]: +12%
            - heading "0" [level=3] [ref=e92]
            - paragraph [ref=e93]: Present Today
            - paragraph [ref=e94]: vs last week
          - generic [ref=e95]:
            - generic [ref=e96]: "-3"
            - heading "0" [level=3] [ref=e107]
            - paragraph [ref=e108]: Absent Today
            - paragraph [ref=e109]: from yesterday
          - generic [ref=e110]:
            - generic [ref=e111]: "+2"
            - heading "0" [level=3] [ref=e120]
            - paragraph [ref=e121]: Late Today
            - paragraph [ref=e122]: needs attention
          - generic [ref=e123]:
            - generic [ref=e124]: +5%
            - heading "0%" [level=3] [ref=e133]
            - paragraph [ref=e134]: Attendance Rate
            - paragraph [ref=e135]: last 30 days
        - generic [ref=e136]:
          - heading "Quick Actions" [level=2] [ref=e137]
          - generic [ref=e138]:
            - button "Add Employee Manage staff" [ref=e139] [cursor=pointer]:
              - generic [ref=e146]:
                - generic [ref=e147]: Add Employee
                - text: Manage staff
            - button "Mark Attendance Daily tracking" [ref=e148] [cursor=pointer]:
              - generic [ref=e152]:
                - generic [ref=e153]: Mark Attendance
                - text: Daily tracking
            - button "View Reports Analytics" [ref=e154] [cursor=pointer]:
              - generic [ref=e159]:
                - generic [ref=e160]: View Reports
                - text: Analytics
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('AMS Feature Test', async ({ page }) => {
  4  |   // Navigate to login
  5  |   await page.goto('https://ams-ame-a6d5.vercel.app/login');
  6  |   
  7  |   // Test login
  8  |   await page.fill('input[type="email"]', 'zeidanvorpa@gmail.com');
  9  |   await page.fill('input[type="password"]', 'Novercron');
  10 |   await page.click('button[type="submit"]');
  11 |   
  12 |   // Wait for navigation to dashboard
  13 |   await page.waitForURL('**/dashboard', { timeout: 10000 });
  14 |   
  15 |   // Check if dashboard loaded
  16 |   await expect(page.getByText('Dashboard')).toBeVisible();
  17 |   
  18 |   // Test People page
  19 |   await page.click('text=People');
> 20 |   await page.waitForURL('**/people');
     |              ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  21 |   await expect(page.getByText('People')).toBeVisible();
  22 |   
  23 |   // Test Add Employee button
  24 |   await page.click('text=Add Employee');
  25 |   await expect(page.locator('text=Add Employee')).toBeVisible();
  26 |   
  27 |   // Test Attendance page
  28 |   await page.click('text=Attendance');
  29 |   await page.waitForURL('**/attendance');
  30 |   await expect(page.getByText('Attendance')).toBeVisible();
  31 |   
  32 |   // Test Reports page
  33 |   await page.click('text=Reports');
  34 |   await page.waitForURL('**/reports');
  35 |   await expect(page.getByText('Reports')).toBeVisible();
  36 |   
  37 |   console.log('All basic navigation tests passed');
  38 | });
  39 | 
```