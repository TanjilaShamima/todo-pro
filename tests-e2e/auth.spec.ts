import { expect, test } from '@playwright/test';

// Basic auth redirects and login flow

test.describe('Auth redirects', () => {
    test('unauthenticated user redirected to /login', async ({ page }) => {
        await page.goto('/app/todos');
        await expect(page).toHaveURL(/\/login$/);
    });

    test('login then redirect to /app/todos', async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('you@example.com').fill('user@example.com');
        await page.getByPlaceholder('Your password').fill('password');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/\/app\/todos$/);
    });
});
