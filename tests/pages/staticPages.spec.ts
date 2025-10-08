import { test, expect } from 'playwright-test-coverage';

test('load home page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/JWT/);
});

test('load history page', async ({ page }) => {
    await page.goto('http://localhost:5173/history');
    await expect(page.getByRole('heading', { name: /Mama Rucci, my my/i })).toBeVisible();
});