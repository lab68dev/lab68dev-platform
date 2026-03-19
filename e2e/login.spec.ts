import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show validation on empty submit', async ({ page }) => {
    await page.goto('/login')
    // The HTML5 "required" attribute should prevent form submission
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('required', '')
  })

  test('should have a link to signup', async ({ page }) => {
    await page.goto('/login')
    const signupLink = page.locator('a[href="/signup"]')
    await expect(signupLink).toBeVisible()
  })

  test('should have back to home link', async ({ page }) => {
    await page.goto('/login')
    const homeLink = page.locator('a[href="/"]')
    await expect(homeLink).toBeVisible()
  })
})
