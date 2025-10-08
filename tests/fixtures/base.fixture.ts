import { test as base } from 'playwright-test-coverage';
import { mockAuthAndUserRoutes } from '../mocks/routes/auth.route';
import { mockMenuRoute } from '../mocks/routes/menu.route';
import { mockFranchiseRoute } from '../mocks/routes/franchise.route';
import { mockOrderRoute } from '../mocks/routes/order.route';

export function useGeneralMocks(t = base) {
    return t.extend({
        page: async ({ page }, use) => {
            await Promise.all([
                mockAuthAndUserRoutes(page),
                mockMenuRoute(page),
                mockFranchiseRoute(page),
                mockOrderRoute(page),
            ]);
            await page.goto('/');
            await use(page);
        },
    });
}