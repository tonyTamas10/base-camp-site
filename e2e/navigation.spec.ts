import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'];

test.describe('site navigation', () => {
  test('reaches every section from the navigation', async ({ page, isMobile }) => {
    await page.goto('/');
    const openMenu = async () => {
      if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
    };
    const nav = page.getByRole('navigation', { name: 'Primary' });

    await openMenu();
    await nav.getByRole('link', { name: 'Sprints' }).click();
    await expect(page).toHaveURL(/\/events\/sprints(\?|$)/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sprints');

    await openMenu();
    await nav.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
    await expect(nav.getByRole('link', { name: 'Register' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('skip link jumps to the main content', async ({ page }) => {
    await page.goto('/register');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('shows a 404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/events/not-a-sport');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Off the Loop');
  });

  for (const path of ['/events', '/register', '/events/minifootball/autumn-student-cup-2025']) {
    test(`${path} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'The menu only exists on phones');

  test('opens with focus on the first item and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: 'Open menu' });

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: 'Home', exact: true }),
    ).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toBeFocused();
  });
});
