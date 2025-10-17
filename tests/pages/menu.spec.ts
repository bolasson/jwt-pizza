import { expect } from 'playwright-test-coverage';
import { useGeneralMocks } from '../fixtures/base.fixture';

const test = useGeneralMocks();

test.describe('login and purchase menu item', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByPlaceholder('Email address').fill('d@jwt.com');
        await page.getByPlaceholder('Password').fill('a');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
    });

    test('purchase menu item', async ({ page }) => {
        // Go to order page
        await page.getByRole('button', { name: 'Order now' }).click();

        // Create order
        await expect(page.locator('h2')).toContainText('Awesome is a click away');
        await page.getByRole('combobox').selectOption('4');
        await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
        await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
        await expect(page.locator('form')).toContainText('Selected pizzas: 2');
        await page.getByRole('button', { name: 'Checkout' }).click();

        // Pay
        await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
        await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
        await expect(page.locator('tbody')).toContainText('Veggie');
        await expect(page.locator('tbody')).toContainText('Pepperoni');
        await expect(page.locator('tfoot')).toContainText('0.008 ₿');
        await page.getByRole('button', { name: 'Pay now' }).click();

        // Check balance
        await expect(page.getByText('0.008')).toBeVisible();
    });
});


test('menu wobble animation', async ({ page }) => {
    await page.getByRole('button', { name: 'Order now' }).click();
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('link', { name: 'Image Description Veggie A' })).not.toHaveClass(/animate-wobble/);
});