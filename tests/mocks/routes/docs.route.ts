import { Page } from '@playwright/test';
import { mockServiceDocsData } from '../data/docs.data';

export async function mockDocsRoutes(page: Page) {
    await page.route('**/api/docs', async (route) => {
        const url = route.request().url();
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockServiceDocsData)
        });
    });
}