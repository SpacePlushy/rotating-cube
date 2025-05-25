import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'fs/promises';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../dist-tests/App.js';

// Verify index.html contains root div
 test('index.html has root container', async () => {
   const html = await readFile('./index.html', 'utf8');
   assert.ok(html.includes('<div id="root"></div>'));
 });

// Verify package.json defines dev script
 test('package.json has dev script', async () => {
   const pkg = JSON.parse(await readFile('./package.json', 'utf8'));
   assert.ok(pkg.scripts && pkg.scripts.dev);
 });

// Basic server-side render test for App component
 test('App renders header', () => {
   const html = ReactDOMServer.renderToString(React.createElement(App));
   assert.ok(html.includes('3D Rotating Cube'));
 });
