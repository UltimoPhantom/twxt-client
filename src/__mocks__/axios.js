// Mock axios implementation for jest
const axios = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn()
};

export default axios;
