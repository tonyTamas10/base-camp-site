import { expect, test } from '@playwright/test';

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

test('the admin asks visitors to sign in', async ({ page }) => {
  test.skip(!process.env.DATABASE_URI, 'Needs the CMS (a database)');
  await page.goto('/admin');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
});

test.describe('publishing', () => {
  // Edits shared content, so it runs once, on the test database only.
  test.skip(({ isMobile }) => isMobile, 'Runs once, on desktop');
  test.skip(!email || !password, 'Needs SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (test database)');

  test('an edit in the admin appears on the public site', async ({ page, request }) => {
    const path = '/events/sprints/100m-open-2025';
    const login = await request.post('/api/users/login', { data: { email, password } });
    expect(login.ok()).toBe(true);
    const { token } = (await login.json()) as { token: string };
    const headers = { Authorization: `JWT ${token}` };

    const found = await request.get(
      '/api/events?where[slug][equals]=100m-open-2025&depth=0&limit=1',
      { headers },
    );
    const { docs } = (await found.json()) as { docs: Array<{ id: number; name: string }> };
    const event = docs[0]!;

    const rename = (name: string) =>
      request.patch(`/api/events/${event.id}`, { headers, data: { name, _status: 'published' } });

    try {
      expect((await rename('Renamed Sprint')).ok()).toBe(true);
      await expect(async () => {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Renamed Sprint', {
          timeout: 1000,
        });
      }).toPass({ timeout: 20_000 });
    } finally {
      await rename(event.name);
    }
  });
});
