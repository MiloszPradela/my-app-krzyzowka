const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/user/signin/');
    await page.fill('input[name="email"]', 'milosz.pradela1@gmail.com'); // Wstaw poprawne dane logowania
    await page.fill('input[name="password"]', 'Haslo123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.locator('h1')).toContainText('Twój profil');
  });

  test('should display error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/user/signin/');
    await page.fill('input[name="email"]', 'invalid@example.com'); // Nieprawidłowe dane
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Nieprawidłowe dane logowania');
  });
});
