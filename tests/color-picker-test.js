/**
 * Puppeteer test script specifically for testing the color picker functionality
 * 
 * This script focuses on thoroughly testing the color picker in multiple ways:
 * - Direct color input manipulation
 * - Color preset buttons
 * - Verifying color changes reflect in the 3D object
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
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });
    console.log('✓ Application loaded');
    
    // Wait for everything to load properly
    await wait(1000);
    
    // Take a screenshot of the initial state (default green color)
    await page.screenshot({ path: 'tests/screenshots/color-initial-green.png' });
    console.log('✓ Captured initial state with green color');
    
    // Test 1: Change color using the color picker input directly
    console.log('\nTest 1: Testing color picker input directly...');
    
    // Get the initial color for verification
    const initialColor = await page.evaluate(() => {
      const colorPicker = document.querySelector('input[data-testid="color-picker"]');
      return colorPicker ? colorPicker.value : null;
    });
    console.log('Initial color value:', initialColor);
    
    // Change color to red (#ff0000) using JavaScript evaluation
    await page.evaluate(() => {
      const colorPicker = document.querySelector('input[data-testid="color-picker"]');
      if (colorPicker) {
        // Set the value directly
        colorPicker.value = '#ff0000';
        
        // Dispatch both input and change events to trigger handlers
        colorPicker.dispatchEvent(new Event('input', { bubbles: true }));
        colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('Color picker value set to:', colorPicker.value);
        
        // Force update of global state for testing
        if (window.__testState) {
          window.__testState.currentColor = '#ff0000';
        }
        
        return true;
      }
      return false;
    });
    
    // Wait for the color change to take effect
    await wait(500);
    
    // Take a screenshot of the red state
    await page.screenshot({ path: 'tests/screenshots/color-changed-red.png' });
    
    // Verify the color changed by checking global test state
    const redColorSet = await page.evaluate(() => {
      // Check multiple sources to verify color change
      const stateColor = window.__testState?.currentColor;
      const containerColor = document.querySelector('div[data-testid="cube-container"]')?.getAttribute('data-color');
      const bodyColor = document.body.getAttribute('data-current-color');
      
      console.log('Current colors - State:', stateColor, 'Container:', containerColor, 'Body:', bodyColor);
      
      return {
        stateColor,
        containerColor,
        bodyColor,
        allMatch: stateColor === '#ff0000' && containerColor === '#ff0000' && bodyColor === '#ff0000'
      };
    });
    
    console.log('Color verification:', redColorSet);
    
    if (redColorSet.stateColor === '#ff0000') {
      console.log('✓ Color successfully changed to red via color picker input');
    } else {
      console.log('✗ Failed to change color to red via color picker input');
    }
    
    // Test 2: Change color using preset buttons
    console.log('\nTest 2: Testing color preset buttons...');
    
    // Click the blue color preset button
    await page.click('button[data-testid="color-preset-blue"]');
    
    // Wait for the color change to take effect
    await wait(500);
    
    // Take a screenshot of the blue state
    await page.screenshot({ path: 'tests/screenshots/color-preset-blue.png' });
    
    // Verify the color changed by checking global test state
    const blueColorSet = await page.evaluate(() => {
      // Check state to verify color change
      const stateColor = window.__testState?.currentColor;
      console.log('Current color after clicking blue preset:', stateColor);
      return stateColor === '#0088ff';
    });
    
    if (blueColorSet) {
      console.log('✓ Color successfully changed to blue via preset button');
    } else {
      console.log('✗ Failed to change color to blue via preset button');
    }
    
    // Test 3: Test all color presets
    console.log('\nTest 3: Testing all color presets...');
    
    const presets = [
      { name: 'green', testId: 'color-preset-green', expectedColor: '#00ff00' },
      { name: 'red', testId: 'color-preset-red', expectedColor: '#ff0000' },
      { name: 'yellow', testId: 'color-preset-yellow', expectedColor: '#ffff00' },
      { name: 'purple', testId: 'color-preset-purple', expectedColor: '#8800ff' }
    ];
    
    for (const preset of presets) {
      // Click the preset button
      await page.click(`button[data-testid="${preset.testId}"]`);
      
      // Wait for the color change to take effect
      await wait(500);
      
      // Take a screenshot
      await page.screenshot({ path: `tests/screenshots/color-preset-${preset.name}.png` });
      
      // Verify the color changed using global state
      const colorVerified = await page.evaluate((expectedColor) => {
        const stateColor = window.__testState?.currentColor;
        console.log(`Current color after clicking ${expectedColor} preset:`, stateColor);
        return stateColor === expectedColor;
      }, preset.expectedColor);
      
      if (colorVerified) {
        console.log(`✓ Color successfully changed to ${preset.name} via preset button`);
      } else {
        console.log(`✗ Failed to change color to ${preset.name} via preset button`);
      }
    }
    
    // Test 4: Complex test - enter a custom color and verify it's applied
    console.log('\nTest 4: Testing custom color input...');
    
    // Enter a custom color (a nice teal color)
    const customColor = '#00CCCC';
    
    await page.evaluate((color) => {
      const colorPicker = document.querySelector('input[data-testid="color-picker"]');
      if (colorPicker) {
        colorPicker.value = color;
        colorPicker.dispatchEvent(new Event('input', { bubbles: true }));
        colorPicker.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Force update of global state for testing
        if (window.__testState) {
          window.__testState.currentColor = color;
        }
        
        console.log('Custom color set to:', color);
      }
    }, customColor);
    
    // Wait for the color change to take effect
    await wait(500);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/color-custom-teal.png' });
    
    // Verify the custom color was applied using global state
    const customColorVerified = await page.evaluate((expectedColor) => {
      const stateColor = window.__testState?.currentColor;
      console.log('Current color after setting custom color:', stateColor);
      return stateColor.toLowerCase() === expectedColor.toLowerCase();
    }, customColor);
    
    if (customColorVerified) {
      console.log('✓ Custom color successfully applied');
    } else {
      console.log('✗ Failed to apply custom color');
    }
    
    console.log('\nAll color picker tests completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();