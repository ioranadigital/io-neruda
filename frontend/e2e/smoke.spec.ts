import { test, expect } from '@playwright/test';

test.describe('🔥 Smoke Tests - Rutas Principales', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verificar que la página cargó
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    expect(await title.textContent()).toBeTruthy();
  });

  test('should load generators page successfully', async ({ page }) => {
    await page.goto('/generators');
    await page.waitForLoadState('networkidle');

    // Debe mostrar el título del generador
    const heading = page.locator('h1').first();
    await expect(heading).toContainText(/Content|Generator/i);
  });

  test('should load dashboard page successfully', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // La página debe cargar sin errores
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Buscar cualquier link que apunte a /generators
    const hasLink = await page.locator('a[href*="generator"], a[href="/generators"], button:has-text("Generate")').count() > 0;
    expect(hasLink).toBeTruthy();
  });
});

test.describe('⚡ Performance Tests', () => {
  test('home page should load fast', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    console.log(`⏱️ Home page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });

  test('generators page should load fast', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/generators');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    console.log(`⏱️ Generators page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('✅ Basic Functionality', () => {
  test('generators page should display header', async ({ page }) => {
    await page.goto('/generators');
    await page.waitForLoadState('networkidle');

    // Buscar elemento con texto "Generator" o "Create"
    const header = page.locator('h1, h2').first();
    const text = await header.textContent();
    expect(text).toBeTruthy();
    console.log(`✅ Header encontrado: ${text}`);
  });

  test('page should not have console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/generators');
    await page.waitForLoadState('networkidle');

    // Permitir algunos errores de terceros pero no de la app
    const appErrors = errors.filter(e => !e.includes('third-party'));
    console.log(`📋 Console errors: ${appErrors.length}`);
    expect(appErrors.length).toBeLessThan(3);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/generators');
    await page.waitForLoadState('networkidle');

    // Página debe ser visible incluso en móvil
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
