import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, gotoSettled } from './support/a11y';

test.describe('the Loop on home', () => {
  test('turns with the keyboard and opens a year as a deck', async ({ page }) => {
    await page.goto('/');
    const dial = page.getByRole('slider', { name: 'Year dial on the Base Camp Loop' });
    await expect(dial).toHaveAttribute('aria-valuenow', '2025');
    await expect(dial).toHaveAttribute('aria-valuetext', '2025, 17 events, all sports');

    await dial.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(dial).toHaveAttribute('aria-valuenow', '2024');
    await expect(page.getByText('2024: 14 events')).toBeAttached();

    await page.keyboard.press('Enter');
    const deck = page.getByRole('region', { name: 'Event deck' });
    await expect(deck).toBeVisible();
    await expect(deck.getByText('01 / 14')).toBeVisible();

    await deck.getByRole('button', { name: 'Next event' }).click();
    await expect(deck.getByText('02 / 14')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(deck).toBeHidden();
    await expect(dial).toBeFocused();
  });

  test('has no detectable accessibility violations with the deck open', async ({ page }) => {
    await gotoSettled(page, '/');
    await page.getByRole('slider').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('region', { name: 'Event deck' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

test.describe('the events hub', () => {
  test('restores the year from the URL and opens an event', async ({ page }) => {
    await page.goto('/events/sprints?year=2019');
    await expect(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '2019');

    await page.getByRole('link', { name: 'Open Flying 30s 2019' }).click();
    await expect(page).toHaveURL(/\/events\/sprints\/flying-30s-2019$/);
  });

  test('keeps the selected year and filter in the URL', async ({ page }) => {
    await page.goto('/events');
    const dial = page.getByRole('slider');
    await dial.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/year=2026/);

    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page).toHaveURL(/when=upcoming/);
  });

  test('offers the nearest year when a year has no events', async ({ page }) => {
    await page.goto('/events/sprints?year=2020');
    await expect(page.getByRole('heading', { name: 'No sprints events in 2020' })).toBeVisible();

    await page.getByRole('button', { name: 'Nearest year with events' }).click();
    await expect(page.getByRole('slider')).not.toHaveAttribute('aria-valuenow', '2020');
  });

  test('invites suggestions under future sports', async ({ page }) => {
    await page.goto('/events/future');
    await expect(page.getByRole('link', { name: 'Suggest a sport' })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
