import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load and display the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/lab68dev/i)
  })

  test('should have a login link', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.locator('a[href="/login"]').first()
    await expect(loginLink).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.locator('a[href="/login"]').first().click()
    await page.waitForURL('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })
})
