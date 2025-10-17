import { expect } from 'playwright-test-coverage';
import { useGeneralMocks } from '../fixtures/base.fixture';

const test = useGeneralMocks();

test('add menu items', async ({ page }) => {
    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();

    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();
});


test('menu wobble animation', async ({ page }) => {
    await page.getByRole('button', { name: 'Order now' }).click();
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('link', { name: 'Image Description Veggie A' })).not.toHaveClass(/animate-wobble/);
});