/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePaths: [
    '<rootDir>/src',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
};
