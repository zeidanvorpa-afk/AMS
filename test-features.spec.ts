import { test, expect } from '@playwright/test';

test('AMS Feature Test', async ({ page }) => {
  // Navigate to login
  await page.goto('https://ams-ame-a6d5.vercel.app/login');
  
  // Test login
  await page.fill('input[type="email"]', 'zeidanvorpa@gmail.com');
  await page.fill('input[type="password"]', 'Novercron');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Check if dashboard loaded
  await expect(page.getByText('Dashboard')).toBeVisible();
  
  // Test People page
  await page.click('text=People');
  await page.waitForURL('**/people');
  await expect(page.getByText('People')).toBeVisible();
  
  // Test Add Employee button
  await page.click('text=Add Employee');
  await expect(page.locator('text=Add Employee')).toBeVisible();
  
  // Test Attendance page
  await page.click('text=Attendance');
  await page.waitForURL('**/attendance');
  await expect(page.getByText('Attendance')).toBeVisible();
  
  // Test Reports page
  await page.click('text=Reports');
  await page.waitForURL('**/reports');
  await expect(page.getByText('Reports')).toBeVisible();
  
  console.log('All basic navigation tests passed');
});
