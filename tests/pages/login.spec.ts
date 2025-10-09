import { expect } from 'playwright-test-coverage';
import { useGeneralMocks } from '../fixtures/base.fixture';

const test = useGeneralMocks();

test('login', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('logout', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();

    await page.getByRole('link', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'KC' })).toHaveCount(0);
});

test('login with bad credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'Login' }).click();
    await page.route('**/api/auth', async (route) => {
        await route.fulfill({
            status: 401,
            json: { error: 'Bad credentials', reason: 'Wrong password' },
        });
    });

    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('totallynotalegitimatepassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText(/"code":401/i)).toBeVisible();
});

test('register', async ({ page }) => {
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').fill('Papa John');
    await page.getByPlaceholder('Email address').fill('bea@test.com');
    await page.getByPlaceholder('Password').fill('toomanysecretsmakeoneparanoid');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByRole('link', { name: 'PJ' })).toBeVisible();
});

test('register with existing email', async ({ page }) => {
    await page.getByRole('link', { name: 'Register' }).click();

    await page.getByPlaceholder('Full name').fill('Someone Who Already Exists');
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Password').fill('toomanysecretsmakeoneparanoid');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('"code":409')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PJ' })).toHaveCount(0);
});