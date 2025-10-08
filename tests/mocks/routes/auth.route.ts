import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { validUsers, type User } from '../data/users.data';

export async function mockAuthAndUserRoutes(page: Page) {
    let loggedInUser: User | undefined;

    await page.route('*/**/api/auth', async (route) => {
        const method = route.request().method();

        if (method === 'PUT') {
            const loginReq = route.request().postDataJSON();
            const user = validUsers[loginReq.email];

            if (!user || user.password !== loginReq.password) {
                await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
                return;
            }

            loggedInUser = user;
            expect(method).toBe('PUT');

            await route.fulfill({
                status: 200,
                json: { user: loggedInUser, token: 'atotallylegitimatetoken' },
            });
            return;
        }

        if (method === 'DELETE') {
            loggedInUser = undefined;
            await route.fulfill({ status: 200, json: { success: true } });
            return;
        }

        await route.fulfill({ status: 405, json: { error: 'Method Not Allowed' } });
    });

    await page.route('*/**/api/user/me', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: loggedInUser });
    });
}