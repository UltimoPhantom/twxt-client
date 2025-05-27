export default {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
  moduleNameMapper: {
    "^axios$": "<rootDir>/src/__mocks__/axios.js"
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
};
