module.exports = {
  // The root directory that Jest should scan for tests and modules
  roots: ['<rootDir>/src'],

  // File extensions Jest should look for
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // Module name mapper for handling path aliases and static assets
  moduleNameMapper: {
    '^@/components/ui/(.*)$': '<rootDir>/src/__mocks__/ui.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../hooks/useMap$': '<rootDir>/src/__mocks__/useMap.js',
    'react-map-gl': '<rootDir>/src/__mocks__/react-map-gl.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    'mapbox-gl': '<rootDir>/src/__mocks__/fileMock.js',
    '@radix-ui/react-dialog': '<rootDir>/src/__mocks__/ui.js',
    'lucide-react': '<rootDir>/src/__mocks__/fileMock.js'
  },

  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Test environment configuration
  testEnvironment: 'jsdom',

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx}',
    '!src/**/__tests__/**/*',
    '!src/**/__mocks__/**/*'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Ignore patterns
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$'
  ],

  // Global variables available in all test files
  globals: {
    __DEV__: true
  },

  // Verbose output
  verbose: true
}
