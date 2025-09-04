const { test, expect } = require('@playwright/test');

test('MCP Diagnostic: Capture Console Errors', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      // Log to the test runner's console for real-time feedback
      console.log(`[Browser Console Error]: ${msg.text()}`);
      consoleErrors.push(msg.text());
    }
  });

  const pageErrors = [];
  page.on('pageerror', exception => {
    // This catches unhandled exceptions in the page
    console.log(`[Browser Page Error]: ${exception.message}`);
    pageErrors.push(exception.message);
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    // A short wait to allow async operations to potentially fail
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error(`[Playwright Error]: Failed to navigate to page: ${error.message}`);
    // Fail the test immediately if navigation fails
    throw error;
  }

  const allErrors = [...consoleErrors, ...pageErrors];

  // This assertion will make the test fail if any errors were detected,
  // and the test report will contain the logs we printed.
  expect(allErrors, `Found ${allErrors.length} errors on the page. See logs above.`).toEqual([]);
});
