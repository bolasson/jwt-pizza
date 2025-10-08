import { test, expect } from 'playwright-test-coverage';

test('load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/JWT/);
});

test('load history page', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: /Mama Rucci, my my/i })).toBeVisible();
});

test('load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: /The secret sauce/i })).toBeVisible();
});

test('load not found page', async ({ page }) => {
    await page.goto('/thispagedoesnotexistinmyversionofjwtpizzabutitmightininyoursleejensen');
    await expect(page.getByRole('heading', { name: /Oops/i })).toBeVisible();
});