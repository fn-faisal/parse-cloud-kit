// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/src/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
    transform: {
        "\\.ts$": "ts-jest",
    }
  };
  