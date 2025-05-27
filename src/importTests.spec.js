// This file tests if all component imports are working correctly
import React from 'react';
import TextForm from './components/TextForm.jsx';
import TextCloud from './components/TextCloud.jsx';
import App from './App.js';

// Just a simple validation test to ensure all imports are working
describe('Component Import Tests', () => {
  test('All components can be imported', () => {
    // If this test runs without errors, imports are working
    expect(typeof TextForm).toBe('function');
    expect(typeof TextCloud).toBe('function');
    expect(typeof App).toBe('function');
  });
});
