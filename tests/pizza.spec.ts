import { test, expect } from 'playwright-test-coverage';

const testAdminUser = {
  email: 'a@jwt.com',
  password: 'admin',
  name: 'Bryce Lasson',
  roles: [{ role: 'Admin' }]
}

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle(/JWT/);
});

test('login', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: testAdminUser.email, password: testAdminUser.password };
    const loginRes = {
      user: {
        id: 1,
        name: testAdminUser.name,
        email: testAdminUser.email,
        roles: testAdminUser.roles,
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(testAdminUser.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(testAdminUser.password);
  await page.getByRole('button', { name: 'Login' }).click();
});