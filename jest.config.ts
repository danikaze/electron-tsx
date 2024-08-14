import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: [
    '@alex_neo/jest-expect-message',
    '<rootDir>/config/jest/mocks/index.ts',
  ],
  testMatch: ['<rootDir>/src/**/*.(test|spec).(ts|tsx)'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    // ESM: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // https://jestjs.io/docs/webpack#handling-static-assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      // a place to mock files before importing them
      '<rootDir>/config/jest/file-mock.js',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/config/jest/tsconfig.jest.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  verbose: true,
};

export default config;
