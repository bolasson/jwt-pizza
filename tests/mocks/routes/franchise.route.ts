import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { franchiseRes } from '../data/franchises.data';

export async function mockFranchiseRoute(page: Page) {
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });
}