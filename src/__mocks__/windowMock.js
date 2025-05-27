// Mock window.addEventListener and window.removeEventListener
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true
});

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true
});
