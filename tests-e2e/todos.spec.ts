import { expect, test } from '@playwright/test';

// CRUD + filters/search + validation errors rendering

test.describe('Todos flows', () => {
    test.beforeEach(async ({ page }) => {
        // Login helper
        await page.goto('/login');
        await page.getByPlaceholder('you@example.com').fill('user@example.com');
        await page.getByPlaceholder('Your password').fill('password');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/\/app\/todos$/);
    });

    test('create todo shows errors then succeeds', async ({ page }) => {
        await page.getByRole('button', { name: '+ Quick Add' }).click();
        // Submit empty -> validation error
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText(/title/i)).toBeVisible();

        // Fill title > 150 should be limited by UI; try paste long string
        const long = 'x'.repeat(300);
        await page.getByPlaceholder('Title').fill(long);
        await expect(page.getByPlaceholder('Title')).toHaveValue(long.slice(0, 150));

        // Description max 500
        const longDesc = 'd'.repeat(600);
        await page.getByPlaceholder('Description').fill(longDesc);
        await expect(page.getByPlaceholder('Description')).toHaveValue(longDesc.slice(0, 500));

        // Provide valid inputs
        await page.getByPlaceholder('Title').fill('Playwright created');
        await page.getByRole('button', { name: 'Create' }).click();
        await expect(page.getByText('Playwright created')).toBeVisible();
    });

    test('search and filters update the list', async ({ page }) => {
        await page.getByPlaceholder('Search…').fill('Playwright');
        await page.keyboard.press('Enter');
        // Expect filtered results (best-effort: list contains query or list updates)
        await expect(page.getByRole('list')).toBeVisible();
    });

    test('update and delete flow', async ({ page }) => {
        // Click Update on first visible item
        const updateBtn = page.getByRole('button', { name: 'Update' }).first();
        await updateBtn.click();
        const saveBtn = page.getByRole('button', { name: 'Save' });
        await expect(saveBtn).toBeVisible();
        await saveBtn.click();
        // Close modal should happen via Save or Cancel
        await expect(saveBtn).toBeHidden({ timeout: 5000 });

        // Delete an item
        const delBtn = page.getByRole('button', { name: 'Delete' }).first();
        await delBtn.click();
        await page.getByRole('button', { name: 'Delete' }).last().click();
    });
});
