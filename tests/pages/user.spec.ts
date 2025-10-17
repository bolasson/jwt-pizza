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