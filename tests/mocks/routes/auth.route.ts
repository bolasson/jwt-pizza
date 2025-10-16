import type { Page } from '@playwright/test';
import { expect } from 'playwright-test-coverage';
import { Role, validUsers, type User } from '../data/users.data';

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

        if (method === 'POST') {
            const { name, email, password } = route.request().postDataJSON() ?? {};
            if (!name || !email || !password) {
                await route.fulfill({ status: 400, json: { error: 'Missing fields' } });
                return;
            }

            if (validUsers[email]) {
                await route.fulfill({ status: 409, json: { error: 'Email already registered' } });
                return;
            }

            const newUser: User = {
                id: String(Object.keys(validUsers).length + 1),
                name,
                email,
                password,
                roles: [{ role: Role.Diner }],
            };
            validUsers[email] = newUser;
            loggedInUser = newUser;

            await route.fulfill({
                status: 201,
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

    await page.route('**/api/user/**', async (route) => {
        const method = route.request().method();
        if (method !== 'PUT') {
            await route.continue();
            return;
        }

        if (!loggedInUser) {
            await route.fulfill({ status: 401, json: { message: 'unauthorized' } });
            return;
        }

        const url = new URL(route.request().url());
        const lastSeg = url.pathname.split('/').filter(Boolean).pop();
        const userIdFromPath = lastSeg ?? '';
        const body = route.request().postDataJSON() as Partial<Pick<User, 'name' | 'email' | 'password'>>;

        const targetUser = Object.values(validUsers).find((u) => String(u.id) === userIdFromPath);
        if (!targetUser) {
            await route.fulfill({ status: 404, json: { message: 'not found' } });
            return;
        }

        const isSelf = String(loggedInUser.id) === userIdFromPath;
        const isAdmin = loggedInUser.roles?.some((r) => r.role === Role.Admin);
        if (!isSelf && !isAdmin) {
            await route.fulfill({ status: 403, json: { message: 'unauthorized' } });
            return;
        }

        if (typeof body.name === 'string') targetUser.name = body.name;
        if (typeof body.password === 'string' && body.password.length) targetUser.password = body.password;
        if (typeof body.email === 'string' && body.email !== targetUser.email) {
            const oldEmail = targetUser.email;
            (validUsers as any)[body.email] = { ...targetUser, email: body.email };
            delete (validUsers as any)[oldEmail];
        }

        const updated = Object.values(validUsers).find((u) => String(u.id) === userIdFromPath)!;
        if (isSelf) {
            loggedInUser = { ...updated, password: '' };
        }

        const responseUser = { ...updated, password: '' };
        const mockNewToken = 'tttttt';
        await route.fulfill({ status: 200, json: { user: responseUser, token: mockNewToken } });
    });

}