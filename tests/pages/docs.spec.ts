import { test, expect } from 'playwright-test-coverage';
import { mockDocsRoutes } from '../mocks/routes/docs.route';

test('load api docs', async ({ page }) => {
    await mockDocsRoutes(page);
    await page.goto('/docs/service');
    await expect(page.getByRole('heading', { name: /JWT Pizza API/i })).toBeVisible();
    await expect(page.getByText('[PUT] /api/auth')).toBeVisible();
    await expect(page.getByText('[GET] /api/order/menu')).toBeVisible();
    await expect(page.getByText('[GET] /api/franchise/:userId')).toBeVisible();
});