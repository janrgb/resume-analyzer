import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid'; // For generating unique test data if not already included in your project.
import fs from 'fs'
import { error } from 'console';

let uniqueUsername, uniqueEmail, password

// Helper function to generate unique email addresses
function generateUniqueEmail() {
  return `testuser_${uuidv4()}@example.com`;
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://192.168.56.1:8910/', { timeout: 60000 });
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
test('end-to-end test file.', async ({ page }) => {
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

  expect(fs.existsSync(filePath)).toBe(true);

  const fileStats = fs.statSync(filePath);
  expect(fileStats.size).toBeGreaterThan(0);
});

//needs fixing
test('invalid upload type', async ({ page }) => {
  // Fill out registration form.
  /*await page.getByLabel('Username').fill(uniqueUsername);
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm Password', { exact: true }).fill(password);*/

  // Fill out registration form with type and delay
  const usernameField = 'input[name="username"]';
  const emailField = 'input[name="email"]';
  const passwordField = 'input[name="password"]';
  const confirmPasswordField = 'input[name="confirm password"]';
  //const signUpButton = 'button[name="Sign Up"]';
  const signUpButton = "[data-testid='submit-sign-up']";
  const loginButton = "[data-testid='submit-login']";

  // Handle reg success dialog.
  /*
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('User registered');
    await dialog.accept();
  });

  // Submit registration form.
  await page.getByRole('button', { name: 'Sign Up' }).click();

  // Login with new credentials.
  console.log("Filling login form...")
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Password', { exact: true }).fill(password);

  // Click the login button and wait for the URL to change to the Resume Upload page
  console.log("Clicking login button...")
  await page.getByRole('button', { name: 'Log In' }).click();
  console.log("Clicked login button.")

  // Verify redirection to ResumeUpload page.
  console.log("Navigating to Resume Upload...")
  await expect(page).toHaveTitle(/Resume Upload/);
  console.log("Navigated to Resume Upload.")

  // Attempt to upload an invalid file type.
  await page.getByTestId('file_input').setInputFiles('./e2e/stupid.txt');

  // Check for error message related to invalid file type.
  const errorMessage = page.locator('.error');
  await expect(errorMessage).toContainText('Only PDF files are allowed');
  */

  await page.click(usernameField);
  await page.type(usernameField, uniqueUsername, { delay: 100 });

  await page.click(emailField);
  await page.type(emailField, uniqueEmail, { delay: 100 });

  await page.click(passwordField);
  await page.type(passwordField, password, { delay: 100 });

  await page.click(confirmPasswordField);
  await page.type(confirmPasswordField, password, { delay: 100 });

   // Handle registration success dialog
   page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('User registered');
    await dialog.accept();
  });

  // Submit registration form
  await page.click(signUpButton, { delay: 100 });

  // Log in with new credentials using type and delay
  console.log('Filling login form...');
  await page.click(emailField);
  await page.type(emailField, uniqueEmail, { delay: 100 });

  await page.click(passwordField);
  await page.type(passwordField, password, { delay: 100 });

  console.log('Clicking login button...');
  await page.click(loginButton, { delay: 100 });

  // Wait for redirection
  console.log('Waiting for navigation...');
  await page.waitForURL('**/resume-upload', { timeout: 60000 });

  // Verify redirection to ResumeUpload page
  console.log('Navigated to Resume Upload page.');
  await expect(page).toHaveTitle(/Resume Upload/);

  // Attempt to upload an invalid file type
  const fileInput = 'input[data-testid="file_input"]';
  await page.setInputFiles(fileInput, './e2e/stupid.txt');

  // Check for error message related to invalid file type
  const errorMessage = page.locator('.error');
  await expect(errorMessage).toContainText('Only PDF files are allowed');
});
