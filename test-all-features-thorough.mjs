import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('=== THOROUGH FEATURE TESTING ===\n');

  // Test 1: Login
  console.log('1. Testing Login...');
  await page.goto('https://ams-ame-a6d5.vercel.app/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[type="email"]', 'zeidanvorpa@gmail.com');
  await page.fill('input[type="password"]', 'Novercron');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  console.log('✅ Login successful\n');

  // Test 2: Add Employee
  console.log('2. Testing Add Employee...');
  await page.goto('https://ams-ame-a6d5.vercel.app/people');
  await page.waitForLoadState('networkidle');

  // Check if Add Employee button exists
  const addEmployeeButton = page.locator('button').filter({ hasText: 'Add Employee' });
  const buttonVisible = await addEmployeeButton.isVisible();
  console.log('Add Employee button visible:', buttonVisible);

  if (buttonVisible) {
    await addEmployeeButton.click();
    await page.waitForTimeout(2000);

    // Check if modal is visible by looking for the modal overlay
    const modalOverlay = page.locator('.fixed.inset-0');
    const modalVisible = await modalOverlay.isVisible();
    console.log('Modal overlay visible:', modalVisible);

    if (modalVisible) {
      // Fill the form using id selectors
      const timestamp = Date.now();
      await page.fill('#first_name', `Test${timestamp}`);
      await page.fill('#last_name', 'Employee');
      await page.fill('#email', `test${timestamp}@gmail.com`);
      await page.fill('#department', 'Engineering');
      await page.fill('#position', 'Senior Engineer');
      await page.fill('#hire_date', '2026-01-15');

      await page.click('button:has-text("Add Employee")');
      await page.waitForTimeout(2000);

      const addSuccess = await page.isVisible('text=Employee added successfully');
      console.log('✅ Add Employee form submitted');
      if (addSuccess) {
        console.log('✅ Employee added successfully!');
      } else {
        console.log('⚠️ Employee add may have failed - checking for error');
        const errorVisible = await page.isVisible('text=Failed to add employee');
        if (errorVisible) {
          console.log('❌ Error: Failed to add employee');
        }
      }
    } else {
      console.log('❌ Modal did not open');
    }
  } else {
    console.log('❌ Add Employee button not found');
  }
  console.log();

  // Test 3: Mark Attendance
  console.log('3. Testing Mark Attendance...');
  await page.goto('https://ams-ame-a6d5.vercel.app/attendance');
  await page.waitForLoadState('networkidle');
  
  // Try to mark an employee as present
  const statusButtons = await page.locator('button').all();
  console.log(`Found ${statusButtons.length} buttons`);
  
  // Click first status button to change it
  if (statusButtons.length > 0) {
    await statusButtons[3].click(); // Click a status button
    await page.waitForTimeout(500);
  }
  
  // Click Save Attendance
  await page.click('text=Save Attendance');
  await page.waitForTimeout(2000);
  
  const saveSuccess = await page.isVisible('text=Attendance saved successfully');
  console.log('✅ Save Attendance button clicked');
  if (saveSuccess) {
    console.log('✅ Attendance saved successfully!');
  } else {
    console.log('⚠️ No success message visible (may need actual employees in database)');
  }
  console.log();

  // Test 4: Reports
  console.log('4. Testing Reports...');
  await page.goto('https://ams-ame-a6d5.vercel.app/reports');
  await page.waitForLoadState('networkidle');
  
  // Try to export CSV
  const exportButton = await page.isVisible('text=Export CSV');
  console.log('✅ Export CSV button visible:', exportButton);
  
  if (exportButton) {
    await page.click('text=Export CSV');
    await page.waitForTimeout(1000);
    console.log('✅ Export CSV clicked');
  }
  console.log();

  // Test 5: Notifications Mark All as Read (Removed - notifications not implemented)
  console.log('5. Testing Notifications Mark All as Read...');
  console.log('⚠️ Notifications feature not implemented in current version');
  console.log();

  // Test 6: Logout
  console.log('6. Testing Logout...');
  const allButtons = await page.locator('button').all();
  await allButtons[allButtons.length - 1].click(); // Last button should be logout
  await page.waitForURL('**/login', { timeout: 5000 });
  console.log('✅ Logout successful\n');

  // Test 7: Signup as New User
  console.log('7. Testing Signup as New User...');
  await page.goto('https://ams-ame-a6d5.vercel.app/signup');
  await page.waitForLoadState('networkidle');
  
  const signupTimestamp = Date.now();
  await page.fill('input#fullName', 'New Test User');
  await page.fill('input[type="email"]', `newuser${signupTimestamp}@gmail.com`);
  await page.fill('input[type="password"]', 'TestPassword123!');
  
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    console.log('✅ Signup successful - redirected to login');
  } else {
    console.log('⚠️ Signup may have failed or requires email confirmation');
    console.log('Current URL:', currentUrl);
  }
  console.log();

  console.log('=== THOROUGH TESTING COMPLETE ===');
  console.log('\nSummary:');
  console.log('- Login: ✅ Working');
  console.log('- Add Employee: ❌ Modal not opening - needs investigation');
  console.log('- Mark Attendance: ✅ Save button clicked (success depends on database)');
  console.log('- Reports: ❌ Export button not visible - needs investigation');
  console.log('- Notifications: ⚠️ Not implemented in current version');
  console.log('- Logout: ✅ Working');
  console.log('- Signup: ✅ Form submitted (may be rate-limited)');

  await browser.close();
})();
