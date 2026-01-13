import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // #given - navigate to login page (in beforeEach)
    // #when - page loads
    // #then
    await expect(page.getByRole('heading', { name: 'THW Stocktaking' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // #given - on login page with empty form
    // #when
    await page.getByRole('button', { name: 'Sign In' }).click();
    // #then
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show email validation error for invalid email', async ({ page }) => {
    // #given - on login page
    // #when
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    // #then
    await expect(page.getByText('Enter a valid email')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    // #given - password field with hidden text
    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('secret123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // #when - click show button
    await page.getByRole('button', { name: 'Show password' }).click();

    // #then - password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // #when - click hide button
    await page.getByRole('button', { name: 'Hide password' }).click();

    // #then - password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
