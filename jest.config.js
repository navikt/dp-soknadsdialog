module.exports = {
  globalSetup: "<rootDir>/jest.env.js",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(nav-.+)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transform-stub",
    "^jose/(.*)$": "identity-obj-proxy",
    "^@navikt/dp-auth/(.*)$": "<rootDir>/node_modules/@navikt/dp-auth/dist/$1",
  },
  testEnvironment: "jsdom"
};
