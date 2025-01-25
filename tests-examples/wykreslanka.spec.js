const { test, expect } = require('@playwright/test');

test.describe('Wykreślanka - testy gry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('Użytkownik może się zalogować', async ({ page }) => {
    await page.click('text=Zaloguj');
    await page.fill('input[name="email"]', 'milosz.pradela1@gmail.com');
    await page.fill('input[name="password"]', 'Haslo123'); 
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/protected/user/nowa-gra');
    await expect(page.locator('h1')).toContainText('Nowa Gra');
  });

  test('Użytkownik może rozpocząć nową grę', async ({ page }) => {
    await page.goto('http://localhost:3000/protected/user/nowa-gra');
    await page.selectOption('select', 'easy');
    await page.click('button:has-text("Rozpocznij grę")'); 
    await expect(page.locator('.grid')).toBeVisible();
    await expect(page.locator('.timer')).toContainText('Pozostały czas');
  });

  test('Gra kończy się wygraną', async ({ page }) => {
    await page.goto('http://localhost:3000/protected/user/nowa-gra');
    await page.selectOption('select', 'easy'); 
    await page.click('button:has-text("Rozpocznij grę")');
    
    const words = ['DOG', 'CAT', 'BIRD'];
    for (const word of words) {
      await page.locator(`text=${word}`).click();
    }

    await expect(page.locator('.summary')).toBeVisible();
    await expect(page.locator('.summary')).toContainText('Gratulacje!');
    await expect(page.locator('.summary')).toContainText('Łączna liczba punktów:');
  });

  test('Gra kończy się przegraną', async ({ page }) => {
    await page.goto('http://localhost:3000/protected/user/nowa-gra');
    await page.selectOption('select', 'easy');
    await page.click('button:has-text("Rozpocznij grę")');

    await page.waitForTimeout(300000);
    await expect(page.locator('.summary')).toBeVisible();
    await expect(page.locator('.summary')).toContainText('Gra zakończona!');
    await expect(page.locator('.summary')).toContainText('Zdobyłeś 0 punktów.');
  });
});
