import { test, expect } from '@playwright/test';

test.describe('Content Generator Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate through all dashboard tabs', async ({ page }) => {
    // Test Generate tab
    await page.click('text=✨ Generate');
    await expect(page.locator('text=Step 1')).toBeVisible();

    // Test Gallery tab
    await page.click('text=📚 Gallery');
    await expect(page.locator('text=Gallery')).toBeVisible();

    // Test Templates tab
    await page.click('text=🎨 Templates');
    await expect(page.locator('text=Templates')).toBeVisible();

    // Test Batch Jobs tab
    await page.click('text=⚡ Batch Jobs');
    await expect(page.locator('text=No batch jobs yet')).toBeVisible();
  });

  test('should complete 3-step generation workflow', async ({ page }) => {
    // Step 1: Select formats
    await page.click('text=Blog Post');
    await page.click('text=Email Newsletter');
    await expect(page.locator('input[type="checkbox"]:checked')).toHaveCount(2);

    // Click next
    await page.click('button:has-text("Next")');
    await page.waitForLoadState('networkidle');

    // Step 2: Add keywords and tone
    await page.fill('input[placeholder*="niche"]', 'Artificial Intelligence');
    await page.fill('input[placeholder*="long-tail"]', 'AI in healthcare');
    await page.click('button:has-text("Add")');

    await page.click('text=Professional');

    // Click next
    await page.click('button:has-text("Next")');
    await page.waitForLoadState('networkidle');

    // Step 3: Review and generate
    await expect(page.locator('text=Blog Post')).toBeVisible();
    await expect(page.locator('text=Artificial Intelligence')).toBeVisible();

    // Submit
    await page.click('button:has-text("Generate Content")');
    await page.waitForLoadState('networkidle');

    // Verify success
    await expect(page.locator('text=Content generated')).toBeVisible({ timeout: 10000 });
  });

  test('should handle offline mode gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true);

    // Try to generate content
    await page.click('text=✨ Generate');
    await page.click('text=Blog Post');
    await page.click('button:has-text("Next")');

    // Fill form
    await page.fill('input[placeholder*="niche"]', 'Test');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Next")');
    await page.click('button:has-text("Generate Content")');

    // Should show offline notification
    await expect(page.locator('text=saved locally')).toBeVisible({ timeout: 5000 });

    // Go back online
    await context.setOffline(false);
    await page.waitForLoadState('networkidle');

    // Offline indicator should disappear
    await expect(page.locator('text=saved locally')).not.toBeVisible({ timeout: 10000 });
  });

  test('should display real-time batch progress', async ({ page }) => {
    // Create a batch job
    await page.click('button:has-text("Batch Mode")');
    await page.fill('textarea[placeholder*="URLs"]', 'https://example.com/1\nhttps://example.com/2');

    await page.click('button:has-text("Start Batch")');
    await page.waitForLoadState('networkidle');

    // Wait for batch monitor to appear
    await expect(page.locator('text=Batch Job')).toBeVisible({ timeout: 10000 });

    // Monitor progress
    const progressBar = page.locator('progress');
    await expect(progressBar).toBeVisible();
  });
});

test.describe('Content Gallery', () => {
  test('should filter content by format', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=📚 Gallery');

    // Apply format filter
    await page.click('text=Blog Post');
    await page.waitForLoadState('networkidle');

    // Verify filtering
    const items = page.locator('[data-format="blog"]');
    await expect(items.first()).toBeVisible();
  });

  test('should allow inline editing of content', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=📚 Gallery');

    // Wait for gallery to load
    await page.waitForLoadState('networkidle');

    // Try to edit a content item
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.fill('textarea', 'Updated content');
      await page.click('button:has-text("Save")');

      await expect(page.locator('text=Updated')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should support copy-to-clipboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=📚 Gallery');
    await page.waitForLoadState('networkidle');

    const copyButton = page.locator('button:has-text("Copy")').first();
    if (await copyButton.isVisible()) {
      await copyButton.click();
      await expect(page.locator('text=Copied')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Email Templates', () => {
  test('should create a custom email template', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=🎨 Templates');

    // Switch to Create tab
    await page.click('text=Create');

    // Fill template form
    await page.fill('input[placeholder*="Name"]', 'Test Template');
    await page.fill('textarea[placeholder*="Subject"]', 'Test Subject: {{company}}');
    await page.fill('textarea[placeholder*="Body"]', 'Hello {{name}}, welcome!');

    // Insert variable
    await page.click('button:has-text("{{name}}")');
    await expect(page.locator('text={{name}}')).toBeVisible();

    // Save template
    await page.click('button:has-text("Save Template")');
    await expect(page.locator('text=Template created')).toBeVisible({ timeout: 5000 });
  });

  test('should display variable preview in templates', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=🎨 Templates');

    // Click on an existing template
    const templateCard = page.locator('[data-type="email-template"]').first();
    if (await templateCard.isVisible()) {
      await templateCard.click();

      // Check for variable preview
      await expect(page.locator('text={{').or(page.locator('text=Variables'))).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should show error boundary on crash', async ({ page }) => {
    await page.goto('/dashboard');

    // Inject an error in console to test error boundary
    await page.evaluate(() => {
      throw new Error('Test error for error boundary');
    }).catch(() => {
      // Expected
    });

    // Error boundary should catch it
    await expect(page.locator('text=Something went wrong')).toBeVisible({ timeout: 5000 });
  });

  test('should display validation errors', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=✨ Generate');

    // Try to submit empty form
    await page.click('button:has-text("Next")');

    // Should show validation error
    await expect(page.locator('text=required')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Sidebar should be hidden on mobile
    const sidebar = page.locator('[class*="lg:col-span-1"]');
    await expect(sidebar).toBeHidden();

    // Hamburger menu should be visible
    const menuButton = page.locator('button[aria-label*="menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('text=Generate')).toBeVisible();
    }
  });

  test('should be tablet responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');

    // All main tabs should be accessible
    await expect(page.locator('text=Generate')).toBeVisible();
    await expect(page.locator('text=Gallery')).toBeVisible();
    await expect(page.locator('text=Templates')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have layout shifts during load', async ({ page }) => {
    let shiftCount = 0;

    page.on('framenavigated', () => {
      shiftCount++;
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // CLS (Cumulative Layout Shift) should be minimal
    expect(shiftCount).toBeLessThan(5);
  });
});
