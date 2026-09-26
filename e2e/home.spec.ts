import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, gotoSettled } from './support/a11y';

test.describe('home page', () => {
  test('shows the Base Camp wordmark', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Base\s*Camp/i);
    await expect(page).toHaveTitle('Base Camp');
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await gotoSettled(page, '/');
    await expectNoA11yViolations(page);
  });
});
