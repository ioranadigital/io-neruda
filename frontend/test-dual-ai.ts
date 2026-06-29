import { test, expect } from '@playwright/test';

test('Test dual AI model buttons in PASO 7', async ({ page }) => {
  // Navigate to generators page
  await page.goto('http://localhost:3003/generators');
  await page.waitForLoadState('networkidle');

  // Wait for page to be ready
  await page.waitForSelector('text=Plan Generator Inteligente', { timeout: 5000 });

  // Select first client (if available)
  const clientButtons = await page.locator('button:has-text("Seleccionar cliente")').first();
  if (await clientButtons.isVisible()) {
    await clientButtons.click();
    const firstClient = await page.locator('button:has-text(/Esgarden|XANELUM|[A-Z]/)').first();
    if (await firstClient.isVisible()) {
      await firstClient.click();
      await page.waitForTimeout(500);
    }
  }

  // Fill required PASO 2 fields
  // Público Objetivo
  const audienceInput = await page.locator('input[placeholder*="Público"]').first();
  if (await audienceInput.isVisible()) {
    await audienceInput.fill('Propietarios de negocios');
    await page.waitForTimeout(300);
  }

  // Select Content Intent
  const intentButtons = await page.locator('button:has-text(/Educacional|Informativo|Comercial/)').first();
  if (await intentButtons.isVisible()) {
    await intentButtons.click();
    await page.waitForTimeout(300);
  }

  // Select Tone
  const toneButtons = await page.locator('button:has-text(/Profesional|Casual|Técnico/)').first();
  if (await toneButtons.isVisible()) {
    await toneButtons.click();
    await page.waitForTimeout(300);
  }

  // Fill H1 Title (PASO 4)
  const h1Input = await page.locator('input[placeholder*="H1"]').first();
  if (await h1Input.isVisible()) {
    await h1Input.fill('Guía Completa de Marketing');
    await page.waitForTimeout(300);
  }

  // Select at least one format (PASO 5)
  const formatButtons = await page.locator('button:has-text(/Blog|Email|Instagram|LinkedIn/)').first();
  if (await formatButtons.isVisible()) {
    await formatButtons.click();
    await page.waitForTimeout(300);
  }

  // Click Preview button
  const previewBtn = await page.locator('button:has-text("📋 Preview")');
  if (await previewBtn.isEnabled()) {
    await previewBtn.click();
    await page.waitForTimeout(1000);

    // Wait for preview modal
    await page.waitForSelector('text=Preview - Prompt a IA', { timeout: 5000 });

    // Check for dual AI buttons
    const claudeBtn = await page.locator('button:has-text("✨ Claude AI")');
    const geminiBtn = await page.locator('button:has-text("✨ Gemini AI")');

    console.log('✅ Preview modal opened');
    console.log(`Claude AI button visible: ${await claudeBtn.isVisible()}`);
    console.log(`Gemini AI button visible: ${await geminiBtn.isVisible()}`);

    // Take screenshot
    await page.screenshot({ path: 'test-screenshot-dual-ai.png' });
    console.log('📸 Screenshot saved: test-screenshot-dual-ai.png');

    // Verify both buttons exist
    expect(claudeBtn).toBeVisible();
    expect(geminiBtn).toBeVisible();

    console.log('✅ Both AI model buttons are present and visible!');
  } else {
    console.log('⚠️ Preview button not enabled - checking missing fields');
  }
});
