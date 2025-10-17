import { test, expect } from 'playwright-test-coverage';

test('close franchise', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-admin-token'));
    await page.route('**/api/user/me', async (route) => {
        await route.fulfill({
            json: { id: 1, name: 'Admin', email: 'admin@jwt.com', roles: [{ role: 'admin' }] },
        });
    });

    await page.route('**/api/user?**', async (route) => {
        await route.fulfill({ json: { users: [], more: false } });
    });

    let franchiseClosed = false;
    const deletableFranchise = {
        id: 101,
        name: 'Deletable Franchise',
        admins: [{ id: 1, name: 'Admin' }],
        stores: [],
    };

    await page.route('**/api/franchise**', async (route) => {
        const data = franchiseClosed
            ? { franchises: [], more: false }
            : { franchises: [deletableFranchise], more: false };
        await route.fulfill({ json: data });
    });

    await page.route('**/api/franchise/101', async (route) => {
        if (route.request().method() === 'DELETE') {
            franchiseClosed = true;
            await route.fulfill({ status: 204, body: '' });
            await page.goto('/admin-dashboard');
        } else {
            await route.continue();
        }
    });

    await page.goto('/admin-dashboard');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('main')).toContainText('Deletable Franchise');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('main')).not.toContainText('Deletable Franchise');
});

test('close store', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('token', 'fake-admin-token'));
    await page.route('**/api/user/me', async (route) => {
        await route.fulfill({
            json: { id: 1, name: 'Admin', email: 'admin@jwt.com', roles: [{ role: 'admin' }] },
        });
    });

    await page.route('**/api/user?**', async (route) => {
        await route.fulfill({ json: { users: [], more: false } });
    });

    let storeClosed = false;
    const deletableStore = { id: 301, name: 'Deletable Store', totalRevenue: 0 };
    const baseFranchise = {
        id: 201,
        name: 'Deletable Franchise',
        admins: [{ id: 1, name: 'Admin' }],
        stores: [deletableStore],
    };

    await page.route('**/api/franchise**', async (route) => {
        const data = storeClosed
            ? { franchises: [{ ...baseFranchise, stores: [] }], more: false }
            : { franchises: [baseFranchise], more: false };
        await route.fulfill({ json: data });
    });

    await page.route('**/api/franchise/201/store/301', async (route) => {
        if (route.request().method() === 'DELETE') {
            storeClosed = true;
            await route.fulfill({ status: 204, body: '' });
            await page.goto('/admin-dashboard');
        } else {
            await route.continue();
        }
    });

    await page.goto('/admin-dashboard');
    await page.reload({ waitUntil: 'networkidle' });
    
    const srow = page.getByRole('row', { name: /Deletable Store/ });
    await expect(srow).toBeVisible();
    await srow.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('main')).not.toContainText('Deletable Store');
});