import { test, expect } from '@playwright/test';

test('health endpoint returns ok', async ({ request }) => {
	const response = await request.get('/api/health');
	expect(response.ok()).toBeTruthy();
	const body = await response.json();
	expect(body.ok).toBe(true);
	expect(body.status).toBe('healthy');
});

test('login page loads', async ({ page }) => {
	await page.goto('/login');
	await expect(page.locator('h1')).toContainText('Sign in');
	await expect(page.locator('input[name="email"]')).toBeVisible();
	await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('unauthenticated user redirected to login', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/\/login/);
});

test('register page loads', async ({ page }) => {
	await page.goto('/register');
	await expect(page.locator('h1')).toContainText('Create an Account');
});
