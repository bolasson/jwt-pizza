import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { validUsers, type User } from '../data/users.data';

export async function mockAuthAndUserRoutes(page: Page) {
    let loggedInUser: User | undefined;

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = route.request().postDataJSON();
        const user = validUsers[loginReq.email];

        if (!user || user.password !== loginReq.password) {
            await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
            return;
        }

        loggedInUser = user;
        expect(route.request().method()).toBe('PUT');

        await route.fulfill({
            json: { user: loggedInUser, token: 'abcdef' },
        });
    });

    await page.route('*/**/api/user/me', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: loggedInUser });
    });
}