import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, gotoSettled } from './support/a11y';

test.describe('team event page', () => {
  const path = '/events/minifootball/autumn-student-cup-2025';

  test('tells the story of a past tournament', async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Autumn Student Cup');
    await expect(page).toHaveTitle('Autumn Student Cup 2025 · Base Camp');

    // The champion is derived from the final's result.
    await expect(
      page.locator('#bracket').getByRole('heading', { name: 'Cetățuia 5' }),
    ).toBeVisible();
    await expect(page.getByRole('table', { name: 'Group A' })).toBeVisible();

    await page.getByText('All 16 results').click();
    await expect(page.locator('#results li')).toHaveCount(16);

    await page.getByRole('link', { name: 'See the results' }).click();
    await expect(page).toHaveURL(/#bracket$/);
  });

  test('links onward on the Loop', async ({ page }) => {
    await page.goto(path);
    const related = page.locator('#related');
    await expect(related.getByText('Next', { exact: true })).toBeVisible();
    await expect(related.getByRole('link')).toHaveCount(3);
  });
});

test.describe('track event page', () => {
  const path = '/events/sprints/100m-open-2025';

  test('shows heats, rankings and records', async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Heat 1' })).toBeVisible();
    await expect(page.locator('#rankings').getByRole('row', { name: /Diana O\./ })).toBeVisible();
    await expect(page.locator('#records')).toContainText('Edition best · Diana O.');
    // Team-only modules never appear on a track event.
    await expect(page.locator('#bracket')).toHaveCount(0);
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await gotoSettled(page, path);
    await expectNoA11yViolations(page);
  });
});

test('an upcoming event invites registration for that event', async ({ page }) => {
  await page.goto('/events/minifootball/student-cup-2026');
  await expect(page.getByText('This week').first()).toBeVisible();
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Register' }).first(),
  ).toHaveAttribute('href', '/register?sport=minifootball&event=student-cup-2026');
});

test('content stays visible with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/events/minifootball/autumn-student-cup-2025');
  await expect(page.locator('[data-reveal]')).toHaveCount(0);
});
