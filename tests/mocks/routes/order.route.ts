import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';

export async function mockOrderRoute(page: Page) {
    await page.route('*/**/api/order', async (route) => {
        const orderReq = route.request().postDataJSON();
        expect(route.request().method()).toBe('POST');
        await route.fulfill({
            json: {
                order: { ...orderReq, id: 23 },
                jwt: 'atotallylegitimatejwt',
            },
        });
    });
}