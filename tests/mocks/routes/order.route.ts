import type { Page } from '@playwright/test';

export async function mockOrderRoute(page: Page) {
    await page.route('**/api/order', async (route) => {
        const method = route.request().method();

        if (method === 'POST') {
            const body = route.request().postDataJSON();
            await route.fulfill({ json: { order: { ...body, id: 23 } } });
            return;
        }

        if (method === 'GET') {
            await route.fulfill({ json: { orders: [] } });
            return;
        }

        await route.fulfill({ status: 405, json: { message: 'method not allowed' } });
    });

    await page.route('**/api/orders', async (route) => {
        await route.fulfill({ json: { orders: [] } });
    });
}