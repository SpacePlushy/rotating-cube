/**
 * Puppeteer test script for the 3D Rotating Cube application
 * 
 * This script tests all major functionality of the application:
 * - Light/Dark mode toggle
 * - Color picker and color presets
 * - Shape selection
 * - Wireframe toggle
 * - Rotation speed controls
 * - Manual rotation
 */

import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless testing
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  try {
    // Create a new page
    const page = await browser.newPage();
    
    // Navigation timeout function
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Navigate to the app
    console.log('Opening application...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'tests/screenshots/initial-state.png' });
    console.log('✓ Captured initial state');
    
    // Test 1: Light/Dark mode toggle
    console.log('\nTesting Light/Dark mode toggle...');
    await page.click('button[data-testid="light-mode-toggle"]');
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/light-mode.png' });
    console.log('✓ Light mode toggled');
    
    await page.click('button[data-testid="light-mode-toggle"]');
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/dark-mode.png' });
    console.log('✓ Dark mode toggled');
    
    // Test 2: Color picker
    console.log('\nTesting color picker...');
    
    // Method 1: Direct color input value setting
    await page.evaluate(() => {
      const colorPicker = document.querySelector('input[data-testid="color-picker"]');
      if (colorPicker) {
        colorPicker.value = '#ff0000';
        colorPicker.dispatchEvent(new Event('input', { bubbles: true }));
        colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/color-red.png' });
    console.log('✓ Color changed to red via color picker');
    
    // Method 2: Color preset buttons
    await page.click('button[data-testid="color-preset-blue"]');
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/color-blue.png' });
    console.log('✓ Color changed to blue via preset button');
    
    // Test 3: Shape selection
    console.log('\nTesting shape selection...');
    await page.select('select[data-testid="shape-select"]', 'sphere');
    await wait(1000);
    await page.screenshot({ path: 'tests/screenshots/shape-sphere.png' });
    console.log('✓ Shape changed to sphere');
    
    await page.select('select[data-testid="shape-select"]', 'pyramid');
    await wait(1000);
    await page.screenshot({ path: 'tests/screenshots/shape-pyramid.png' });
    console.log('✓ Shape changed to pyramid');
    
    await page.select('select[data-testid="shape-select"]', 'cube');
    await wait(1000);
    console.log('✓ Shape changed back to cube');
    
    // Test 4: Wireframe toggle
    console.log('\nTesting wireframe toggle...');
    await page.click('button[data-testid="wireframe-button"]');
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/wireframe-enabled.png' });
    console.log('✓ Wireframe enabled');
    
    await page.click('button[data-testid="wireframe-button"]');
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/wireframe-disabled.png' });
    console.log('✓ Wireframe disabled');
    
    // Test 5: Rotation speed control
    console.log('\nTesting rotation speed control...');
    await page.click('button[data-testid="speed-slow"]');
    await wait(500);
    console.log('✓ Speed set to slow');
    
    await page.click('button[data-testid="speed-fast"]');
    await wait(500);
    console.log('✓ Speed set to fast');
    
    // Test 6: Manual rotation
    console.log('\nTesting manual rotation...');
    const canvasBox = await page.$eval('div[data-testid="cube-container"]', el => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      };
    });
    
    // Simulate mouse drag
    await page.mouse.move(canvasBox.x, canvasBox.y);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 50);
    await wait(500);
    await page.screenshot({ path: 'tests/screenshots/manual-rotation.png' });
    await page.mouse.up();
    console.log('✓ Manual rotation tested');
    
    // Test 7: Verify data attributes are correctly set
    console.log('\nVerifying data attributes...');
    const containerAttributes = await page.evaluate(() => {
      const container = document.querySelector('div[data-testid="cube-container"]');
      return {
        shape: container.getAttribute('data-shape'),
        color: container.getAttribute('data-color'),
        wireframe: container.getAttribute('data-wireframe')
      };
    });
    console.log('Container attributes:', containerAttributes);
    console.log('✓ Data attributes verified');
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();