import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  // Enable error logging
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  // Enable request/response logging
  page.on('request', request => {
    console.log(`[REQUEST] ${request.method()} ${request.url()}`);
  });

  page.on('response', response => {
    console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
  });

  console.log('=== COMPREHENSIVE AMS TESTING ===\n');

  // Helper function to test a button
  async function testButton(buttonInfo, action) {
    console.log(`\n--- Testing: ${buttonInfo} ---`);
    try {
      await action();
      console.log(`✅ ${buttonInfo} - SUCCESS`);
      return true;
    } catch (error) {
      console.log(`❌ ${buttonInfo} - FAILED: ${error.message}`);
      console.log('Console messages:', consoleMessages.slice(-5));
      return false;
    }
  }

  // ===== LOGIN =====
  console.log('\n===== SECTION 1: AUTHENTICATION =====');
  await testButton('Navigate to Login', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/login');
    await page.waitForLoadState('networkidle');
  });

  await testButton('Fill Email', async () => {
    await page.fill('input[type="email"]', 'zeidanvorpa@gmail.com');
  });

  await testButton('Fill Password', async () => {
    await page.fill('input[type="password"]', 'Novercron');
  });

  await testButton('Click Login Button', async () => {
    await page.click('button[type="submit"]');
  });

  await testButton('Wait for Dashboard', async () => {
    await page.waitForURL('**/dashboard', { timeout: 15000 });
  });

  // ===== DASHBOARD =====
  console.log('\n===== SECTION 2: DASHBOARD =====');
  await page.screenshot({ path: 'dashboard-full.png' });

  // Test dashboard quick action buttons
  await testButton('Click "Add Employee" Quick Action', async () => {
    await page.click('text=Add Employee');
    await page.waitForTimeout(2000);
  });

  // Check if modal opened
  const modalVisible = await page.locator('.fixed.inset-0').isVisible();
  console.log(`Modal visible after clicking: ${modalVisible}`);
  if (modalVisible) {
    await page.screenshot({ path: 'modal-opened.png' });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }

  await testButton('Click "Mark Attendance" Quick Action', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/dashboard');
    await page.waitForLoadState('networkidle');
    await page.click('text=Mark Attendance');
    await page.waitForTimeout(2000);
  });

  await testButton('Click "View Reports" Quick Action', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/dashboard');
    await page.waitForLoadState('networkidle');
    await page.click('text=View Reports');
    await page.waitForTimeout(2000);
  });

  // ===== PEOPLE PAGE =====
  console.log('\n===== SECTION 3: PEOPLE MANAGEMENT =====');
  await testButton('Navigate to People', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/people');
    await page.waitForLoadState('networkidle');
  });

  await page.screenshot({ path: 'people-page-full.png' });

  // Test search functionality
  await testButton('Fill Search Box', async () => {
    await page.fill('input[placeholder*="Search"]', 'John');
  });

  await testButton('Clear Search', async () => {
    await page.fill('input[placeholder*="Search"]', '');
  });

  // Test Add Employee button in header
  await testButton('Click "Add Employee" Button (Header)', async () => {
    await page.click('#add-employee-btn');
    await page.waitForTimeout(2000);
  });

  const modalAfterClick = await page.locator('.fixed.inset-0').isVisible();
  console.log(`Modal visible after button click: ${modalAfterClick}`);
  await page.screenshot({ path: 'modal-after-click.png' });

  if (modalAfterClick) {
    console.log('\n--- TESTING MODAL FORM ---');
    await testButton('Fill First Name', async () => {
      await page.fill('#first_name', 'Test');
    });

    await testButton('Fill Last Name', async () => {
      await page.fill('#last_name', 'Employee');
    });

    await testButton('Fill Email', async () => {
      await page.fill('#email', `test${Date.now()}@example.com`);
    });

    await testButton('Fill Department', async () => {
      await page.fill('#department', 'Engineering');
    });

    await testButton('Fill Position', async () => {
      await page.fill('#position', 'Developer');
    });

    await testButton('Fill Hire Date', async () => {
      await page.fill('#hire_date', '2024-01-15');
    });

    await page.screenshot({ path: 'modal-filled.png' });

    await testButton('Click Cancel Button', async () => {
      await page.click('text=Cancel');
      await page.waitForTimeout(1000);
    });
  }

  // Test table buttons (edit, delete actions)
  const allButtons = await page.locator('button').all();
  console.log(`\nTotal buttons on People page: ${allButtons.length}`);

  for (let i = 0; i < allButtons.length; i++) {
    try {
      const buttonText = await allButtons[i].textContent();
      const isVisible = await allButtons[i].isVisible();
      console.log(`Button ${i}: "${buttonText?.trim()}" - Visible: ${isVisible}`);
    } catch (e) {
      console.log(`Button ${i}: Could not get text`);
    }
  }

  // ===== ATTENDANCE PAGE =====
  console.log('\n===== SECTION 4: ATTENDANCE MARKING =====');
  await testButton('Navigate to Attendance', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/attendance');
    await page.waitForLoadState('networkidle');
  });

  await page.screenshot({ path: 'attendance-page-full.png' });

  // Test date picker
  await testButton('Change Date', async () => {
    await page.fill('input[type="date"]', '2024-10-27');
    await page.waitForTimeout(1000);
  });

  // Test attendance status buttons
  await testButton('Click Present Button', async () => {
    const presentButtons = await page.locator('button', { hasText: 'Present' }).all();
    if (presentButtons.length > 0) {
      await presentButtons[0].click();
      await page.waitForTimeout(500);
    } else {
      console.log('No Present buttons found (no employees)');
    }
  });

  await testButton('Click Absent Button', async () => {
    const absentButtons = await page.locator('button', { hasText: 'Absent' }).all();
    if (absentButtons.length > 0) {
      await absentButtons[0].click();
      await page.waitForTimeout(500);
    } else {
      console.log('No Absent buttons found (no employees)');
    }
  });

  await testButton('Click Late Button', async () => {
    const lateButtons = await page.locator('button', { hasText: 'Late' }).all();
    if (lateButtons.length > 0) {
      await lateButtons[0].click();
      await page.waitForTimeout(500);
    } else {
      console.log('No Late buttons found (no employees)');
    }
  });

  await testButton('Click Excused Button', async () => {
    const excusedButtons = await page.locator('button', { hasText: 'Excused' }).all();
    if (excusedButtons.length > 0) {
      await excusedButtons[0].click();
      await page.waitForTimeout(500);
    } else {
      console.log('No Excused buttons found (no employees)');
    }
  });

  // Test Save Attendance button
  await testButton('Click Save Attendance Button', async () => {
    await page.click('text=Save Attendance');
    await page.waitForTimeout(3000); // Wait for save to complete
  });

  // Check for success notification
  const successAlert = await page.locator('text=Employee added successfully').isVisible() ||
                       await page.locator('text=Attendance saved successfully').isVisible();
  console.log(`Success notification visible: ${successAlert}`);

  // ===== REPORTS PAGE =====
  console.log('\n===== SECTION 5: REPORTS =====');
  await testButton('Navigate to Reports', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/reports');
    await page.waitForLoadState('networkidle');
  });

  await page.screenshot({ path: 'reports-page-full.png' });

  // Test month picker
  await testButton('Change Month', async () => {
    await page.fill('input[type="month"]', '2024-10');
    await page.waitForTimeout(1000);
  });

  // Test Export CSV button
  await testButton('Click Export CSV Button', async () => {
    const exportBtn = await page.locator('#export-csv-btn');
    const visible = await exportBtn.isVisible();
    console.log(`Export CSV button visible: ${visible}`);

    if (visible) {
      await exportBtn.click();
      await page.waitForTimeout(2000);
    } else {
      // Try alternative selector
      const exportByText = await page.locator('button', { hasText: 'Export' });
      const visibleByText = await exportByText.isVisible();
      console.log(`Export CSV button visible (by text): ${visibleByText}`);

      if (visibleByText) {
        await exportByText.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  // ===== NAVIGATION =====
  console.log('\n===== SECTION 6: NAVIGATION =====');
  await testButton('Navigate to Dashboard via Sidebar', async () => {
    await page.click('text=Dashboard');
    await page.waitForLoadState('networkidle');
  });

  await testButton('Navigate to People via Sidebar', async () => {
    await page.click('text=People');
    await page.waitForLoadState('networkidle');
  });

  await testButton('Navigate to Attendance via Sidebar', async () => {
    await page.click('text=Attendance');
    await page.waitForLoadState('networkidle');
  });

  await testButton('Navigate to Reports via Sidebar', async () => {
    await page.click('text=Reports');
    await page.waitForLoadState('networkidle');
  });

  // ===== LOGOUT =====
  console.log('\n===== SECTION 7: LOGOUT =====');
  await testButton('Click Logout Button', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/dashboard');
    await page.waitForLoadState('networkidle');

    // Try to find logout button
    const logoutButtons = await page.locator('button').all();
    for (const btn of logoutButtons) {
      const text = await btn.textContent();
      if (text?.toLowerCase().includes('logout') || text?.toLowerCase().includes('sign out')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(2000);
  });

  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    console.log('✅ Logout successful');
  } else {
    console.log('⚠️ Logout may not have worked - current URL:', currentUrl);
  }

  // ===== SIGNUP =====
  console.log('\n===== SECTION 8: SIGNUP =====');
  await testButton('Navigate to Signup', async () => {
    await page.goto('https://ams-azure-ten.vercel.app/signup');
    await page.waitForLoadState('networkidle');
  });

  await page.screenshot({ path: 'signup-page-full.png' });

  const timestamp = Date.now();
  await testButton('Fill Full Name', async () => {
    await page.fill('input#fullName', `Test User ${timestamp}`);
  });

  await testButton('Fill Email', async () => {
    await page.fill('input[type="email"]', `testuser${timestamp}@example.com`);
  });

  await testButton('Fill Password', async () => {
    await page.fill('input[type="password"]', 'TestPassword123!');
  });

  await testButton('Click Signup Button', async () => {
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  // ===== CONSOLE SUMMARY =====
  console.log('\n===== CONSOLE MESSAGES SUMMARY =====');
  const errors = consoleMessages.filter(m => m.type === 'error');
  const warnings = consoleMessages.filter(m => m.type === 'warning');

  console.log(`Total console messages: ${consoleMessages.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(err => console.log(`  - ${err.text}`));
  }

  if (warnings.length > 0) {
    console.log('\nWARNINGS:');
    warnings.forEach(warn => console.log(`  - ${warn.text}`));
  }

  // ===== FINAL SUMMARY =====
  console.log('\n===== TESTING COMPLETE =====');
  console.log('Screenshots saved:');
  console.log('  - dashboard-full.png');
  console.log('  - modal-opened.png (if modal opened)');
  console.log('  - modal-after-click.png');
  console.log('  - modal-filled.png (if modal opened)');
  console.log('  - people-page-full.png');
  console.log('  - attendance-page-full.png');
  console.log('  - reports-page-full.png');
  console.log('  - signup-page-full.png');

  await browser.close();
})();
