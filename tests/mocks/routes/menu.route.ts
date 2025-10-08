import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { menuRes } from '../data/menu.data';

export async function mockMenuRoute(page: Page) {
    await page.route('*/**/api/order/menu', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });
}