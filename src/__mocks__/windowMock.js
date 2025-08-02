Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true
});
