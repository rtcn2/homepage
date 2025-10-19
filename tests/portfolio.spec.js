import { test, expect } from '@playwright/test';

test.describe('Portfolio Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct page title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle('My Portfolio');
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('Professional portfolio');
  });

  test('hamburger menu should work on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 767, height: 800 });
    
    // Check initial state
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toBeHidden();
    
    // Click hamburger and check if menu appears
    await page.click('.hamburger');
    await expect(navMenu).toBeVisible();
    
    // Click again and check if menu disappears
    await page.click('.hamburger');
    await expect(navMenu).toBeHidden();
  });

  test('contact form should have required fields', async ({ page }) => {
    await page.goto('/#contact');
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');

    await expect(nameField).toHaveAttribute('required', '');
    await expect(emailField).toHaveAttribute('required', '');
    await expect(messageField).toHaveAttribute('required', '');
  });

  test('skills section should be visible', async ({ page }) => {
    await page.goto('/#skills');
    const skillsSection = page.locator('#skills');
    await expect(skillsSection).toBeVisible();
  });

  test('projects section should be visible', async ({ page }) => {
    await page.goto('/#projects');
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
  });

  test('skip link should be available on tab', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
  });

  test('form validation shows error messages', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#message-error')).toBeVisible();

    await page.fill('#email', 'invalid-email');
    await expect(page.locator('#email-error')).toBeVisible();
    
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#message', 'Test message content');
    
    await expect(page.locator('#name-error')).toBeEmpty();
    await expect(page.locator('#email-error')).toBeEmpty();
    await expect(page.locator('#message-error')).toBeEmpty();
  });

  test('project filtering works correctly', async ({ page }) => {
    await expect(page.locator('.project')).toHaveCount(3);
    
    await page.click('button[data-filter="web"]');
    await expect(page.locator('.project:not(.hidden)')).toHaveCount(1);
    
    await page.click('button[data-filter="mobile"]');
    await expect(page.locator('.project:not(.hidden)')).toHaveCount(1);
    
    await page.click('button[data-filter="design"]');
    await expect(page.locator('.project:not(.hidden)')).toHaveCount(1);
    
    await page.click('button[data-filter="all"]');
    await expect(page.locator('.project:not(.hidden)')).toHaveCount(3);
  });

  test('lightbox functionality', async ({ page }) => {
    await page.click('.project img');
    await expect(page.locator('#lightbox')).toHaveClass(/active/);
    await expect(page.locator('.lightbox-image')).toBeVisible();
    
    await page.click('.lightbox-close');
    await expect(page.locator('#lightbox')).not.toHaveClass(/active/);
    
    await page.click('.project img');
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/active/);
  });

  test('mobile menu functionality', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await expect(page.locator('.nav-menu')).toBeHidden();
    
    await page.click('.hamburger');
    await expect(page.locator('.nav-menu')).toBeVisible();
    
    await page.click('nav a[href="#projects"]');
    await expect(page.locator('.nav-menu')).toBeHidden();
  });

  test('accessibility features', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    
    await expect(page.locator('nav')).toHaveAttribute('aria-label', 'Main Navigation');
    await expect(page.locator('#lightbox')).toHaveAttribute('aria-modal', 'true');
  });
});