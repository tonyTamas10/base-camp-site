import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, gotoSettled } from './support/a11y';

test('the design system documents the live system', async ({ page }) => {
  await page.goto('/design-system');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Base Camp design system');

  // Contrast is computed from the tokens, not typed in.
  await expect(page.getByText('Ink on paper')).toBeVisible();
  await expect(page.locator('#colour li', { hasText: 'Ink on paper' })).toContainText('AA');

  // The module matrix is generated from the registry: a bracket only fits team sports.
  const bracket = page.getByRole('row', { name: /^bracket/ });
  await expect(bracket.getByRole('img', { name: 'default' })).toHaveCount(1);
  await expect(bracket.getByLabel('not available')).toHaveCount(1);
});

test('the design system has no detectable accessibility violations', async ({ page }) => {
  await gotoSettled(page, '/design-system');
  await expectNoA11yViolations(page);
});
