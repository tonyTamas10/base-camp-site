import { expect, test } from '@playwright/test';

import { expectNoA11yViolations, gotoSettled } from './support/a11y';

test.describe('registration', () => {
  test('preselects the event from the link and confirms', async ({ page }) => {
    await page.goto('/register?sport=minifootball&event=student-cup-2026');
    await expect(page.getByRole('radio', { name: /Student Cup/ })).toBeChecked();

    await page.getByLabel('Full name').fill('Ana Pop');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByRole('button', { name: 'Send registration' }).click();

    await expect(page.getByRole('status')).toContainText(
      'In the live site, Ana Pop would get a confirmation for Student Cup.',
    );
  });

  test('explains problems and focuses the first one', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByRole('button', { name: 'Send registration' }).click();

    const name = page.getByLabel('Full name');
    await expect(name).toBeFocused();
    await expect(name).toHaveAccessibleDescription('Add this to continue.');
    await expect(page.getByLabel('Email')).toHaveAccessibleDescription(
      'Use an email like name@example.com.',
    );
  });
});

test('contact and sponsor forms confirm a valid message', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('Name').fill('Ana');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Message').fill('Hello!');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('Got it');

  await page.goto('/sponsor');
  await page.getByLabel('Organisation').fill('Cluj Coffee');
  await page.getByLabel('Contact email').fill('hi@clujcoffee.ro');
  await page.getByLabel('What would you like to support?').selectOption('kit');
  await page.getByRole('button', { name: 'Start the conversation' }).click();
  await expect(page.getByRole('status')).toContainText('the Base Camp team would reply');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the server validates and confirms on its own', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Add this to continue.').first()).toBeVisible();

    await page.getByLabel('Name').fill('Ana');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Message').fill('Hello!');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Got it')).toBeVisible();
  });
});

for (const path of ['/register', '/sponsor', '/contact']) {
  test(`${path} has no detectable accessibility violations`, async ({ page }) => {
    await gotoSettled(page, path);
    await expectNoA11yViolations(page);
  });
}
