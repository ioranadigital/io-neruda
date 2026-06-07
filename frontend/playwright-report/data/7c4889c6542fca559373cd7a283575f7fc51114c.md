# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> 🔥 Smoke Tests - Rutas Principales >> should load generators page successfully
- Location: e2e\smoke.spec.ts:14:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1').first()
Expected pattern: /Content|Generator/i
Received string:  "Generador de Contenido"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1').first()
    14 × locator resolved to <h1 class="text-4xl font-bold text-white mb-2">Generador de Contenido</h1>
       - unexpected value "Generador de Contenido"

```

```yaml
- heading "Generador de Contenido" [level=1]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('🔥 Smoke Tests - Rutas Principales', () => {
  4   |   test('should load home page successfully', async ({ page }) => {
  5   |     await page.goto('/');
  6   |     await page.waitForLoadState('networkidle');
  7   | 
  8   |     // Verificar que la página cargó
  9   |     const title = page.locator('h1').first();
  10  |     await expect(title).toBeVisible();
  11  |     expect(await title.textContent()).toBeTruthy();
  12  |   });
  13  | 
  14  |   test('should load generators page successfully', async ({ page }) => {
  15  |     await page.goto('/generators');
  16  |     await page.waitForLoadState('networkidle');
  17  | 
  18  |     // Debe mostrar el título del generador
  19  |     const heading = page.locator('h1').first();
> 20  |     await expect(heading).toContainText(/Content|Generator/i);
      |                           ^ Error: expect(locator).toContainText(expected) failed
  21  |   });
  22  | 
  23  |   test('should load dashboard page successfully', async ({ page }) => {
  24  |     await page.goto('/dashboard');
  25  |     await page.waitForLoadState('networkidle');
  26  | 
  27  |     // La página debe cargar sin errores
  28  |     const body = page.locator('body');
  29  |     await expect(body).toBeVisible();
  30  |   });
  31  | 
  32  |   test('should have working navigation links', async ({ page }) => {
  33  |     await page.goto('/');
  34  | 
  35  |     // Buscar cualquier link que apunte a /generators
  36  |     const hasLink = await page.locator('a[href*="generator"], a[href="/generators"], button:has-text("Generate")').count() > 0;
  37  |     expect(hasLink).toBeTruthy();
  38  |   });
  39  | });
  40  | 
  41  | test.describe('⚡ Performance Tests', () => {
  42  |   test('home page should load fast', async ({ page }) => {
  43  |     const startTime = Date.now();
  44  |     await page.goto('/');
  45  |     await page.waitForLoadState('domcontentloaded');
  46  |     const loadTime = Date.now() - startTime;
  47  | 
  48  |     console.log(`⏱️ Home page load time: ${loadTime}ms`);
  49  |     expect(loadTime).toBeLessThan(5000);
  50  |   });
  51  | 
  52  |   test('generators page should load fast', async ({ page }) => {
  53  |     const startTime = Date.now();
  54  |     await page.goto('/generators');
  55  |     await page.waitForLoadState('domcontentloaded');
  56  |     const loadTime = Date.now() - startTime;
  57  | 
  58  |     console.log(`⏱️ Generators page load time: ${loadTime}ms`);
  59  |     expect(loadTime).toBeLessThan(5000);
  60  |   });
  61  | });
  62  | 
  63  | test.describe('✅ Basic Functionality', () => {
  64  |   test('generators page should display header', async ({ page }) => {
  65  |     await page.goto('/generators');
  66  |     await page.waitForLoadState('networkidle');
  67  | 
  68  |     // Buscar elemento con texto "Generator" o "Create"
  69  |     const header = page.locator('h1, h2').first();
  70  |     const text = await header.textContent();
  71  |     expect(text).toBeTruthy();
  72  |     console.log(`✅ Header encontrado: ${text}`);
  73  |   });
  74  | 
  75  |   test('page should not have console errors', async ({ page }) => {
  76  |     const errors: string[] = [];
  77  | 
  78  |     page.on('console', msg => {
  79  |       if (msg.type() === 'error') {
  80  |         errors.push(msg.text());
  81  |       }
  82  |     });
  83  | 
  84  |     await page.goto('/generators');
  85  |     await page.waitForLoadState('networkidle');
  86  | 
  87  |     // Permitir algunos errores de terceros pero no de la app
  88  |     const appErrors = errors.filter(e => !e.includes('third-party'));
  89  |     console.log(`📋 Console errors: ${appErrors.length}`);
  90  |     expect(appErrors.length).toBeLessThan(3);
  91  |   });
  92  | 
  93  |   test('should be responsive on mobile', async ({ page }) => {
  94  |     await page.setViewportSize({ width: 375, height: 667 });
  95  |     await page.goto('/generators');
  96  |     await page.waitForLoadState('networkidle');
  97  | 
  98  |     // Página debe ser visible incluso en móvil
  99  |     const body = page.locator('body');
  100 |     await expect(body).toBeVisible();
  101 |   });
  102 | });
  103 | 
```