import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // For generating unique test data if not already included in your project.

let uniqueUsername, uniqueEmail, password

// Helper function to generate unique email addresses
function generateUniqueEmail() {
  return `testuser_${uuidv4()}@example.com`;
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://192.168.1.210:8910/');
  uniqueUsername = `testuser_${Date.now()}`;
  uniqueEmail = generateUniqueEmail();
  password = 'securepassword123';
});

// Test for proper title on the register page
test('has proper title on register page', async ({ page }) => {
  await expect(page).toHaveTitle(/Register/);
});

// Test for redirection to the login page when "Returning User?" is clicked
test('redirects to login page when "Returning User?" is pressed on register page', async ({ page }) => {
  await page.getByRole('button', { name: 'Returning User?' }).click();

  await expect(page).toHaveTitle(/Login/);
});

// big ahh test
test('tests register and login functionality', async ({ page }) => {
  await page.getByLabel('Username').fill(uniqueUsername);
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password', { exact: true }).fill(password);

  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('User registered');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page).toHaveTitle(/Login/);

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);

  await page.getByRole('button', { name: 'Log In'}).click();

  await expect(page).toHaveTitle(/Resume Upload/);

  await page.getByTestId('file_input').setInputFiles('./e2e/Resume.pdf');

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Upload'}).click();

  await expect(page).toHaveTitle(/Resume Analysis/);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PDF Report'}).click();
  const download = await downloadPromise;

  const filePath = './e2e/' + download.suggestedFilename();
  await download.saveAs(filePath);

  const fs = require('fs');
  expect(fs.existsSync(filePath)).toBe(true);

  const fileStats = fs.statSync(filePath);
  expect(fileStats.size).toBeGreaterThan(0);
});

//needs fixing
test('invalid upload type', async ({ page }) => {
  await page.getByLabel('Username').fill(uniqueUsername);
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password', { exact: true }).fill(password);

  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('User registered');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);

  await page.getByRole('button', { name: 'Log In'}).click();

  await page.getByTestId('file_input').setInputFiles('./e2e/stupid.txt');

  await expect(page.getByTestId('file_input')).toHaveText('Only PDF files are allowed')
});
