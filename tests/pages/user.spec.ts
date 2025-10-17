import { expect } from 'playwright-test-coverage';
import { useGeneralMocks } from '../fixtures/base.fixture';

const test = useGeneralMocks();

test('update user name', async ({ page }) => {
    const newName = Math.random().toString(36).substring(2, 12);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();

    await page.getByRole('link', { name: 'KC' }).click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('textbox').first().fill(`Kai Chen${newName}`);
    await page.getByRole('button', { name: 'Update' }).click();

    await page.getByRole('link', { name: 'Logout' }).click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'KC' }).click();
    await expect(page.getByRole('main')).toContainText(newName);
});

test('list and filter users as admin', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();

    const usersTable = page.getByRole('table').nth(1);

    await expect(usersTable).toContainText('Papa John');
    await expect(usersTable).toContainText('Kai Chen');
    await expect(usersTable).toContainText('a@jwt.com');
    await expect(usersTable).toContainText('d@jwt.com');

    await page.getByLabel('Filter users by name').fill('Kai');
    await page.getByRole('button', { name: 'Submit' }).nth(1).click();

    await expect(usersTable).toContainText('Kai Chen');
    await expect(usersTable).not.toContainText('Papa John');
});

test('delete user', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-admin-token'));
    await page.route('**/api/user/me', async (route) => {
        await route.fulfill({
            json: { id: 1, name: 'Admin', email: 'admin@jwt.com', roles: [{ role: 'admin' }] },
        });
    });

    await page.route('**/api/franchise**', async (route) => {
        await route.fulfill({ json: { franchises: [], more: false } });
    });

    let deleted = false;
    const deleteableDiner = { id: 123, name: 'deleteable diner', email: 'deleteableDiner@test.com', roles: [{ role: 'diner' }] };

    await page.route('**/api/user?**', async (route) => {
        const data = deleted
            ? { users: [], more: false }
            : { users: [deleteableDiner], more: false };
        await route.fulfill({ json: data });
    });

    await page.route('**/api/user/123', async (route) => {
        if (route.request().method() === 'DELETE') {
            deleted = true;
            await route.fulfill({ status: 204, body: '' });
        } else {
            await route.continue();
        }
    });

    await page.goto('/admin-dashboard');

    await expect(page.getByRole('table').nth(1)).toContainText('deleteableDiner@test.com');
    page.once('dialog', (d) => d.accept());

    const row = page.getByRole('row', { name: /deleteableDiner@test\.com/ });
    await row.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('table').nth(1)).toContainText('No users found.');
});