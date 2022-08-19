module.exports = {
  globalSetup: "<rootDir>/jest.env.js",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coveragePathIgnorePatterns: ["src/soknad-fakta/", "src/sanity/", "src/types/"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: ["/node_modules/(?!(nav-.+)/)", "^.+\\.module\\.(css|sass|scss)$"],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|svg)$": "jest-transform-stub",
    "^jose/(.*)$": "identity-obj-proxy",
    "^@navikt/dp-auth/(.*)$": "<rootDir>/node_modules/@navikt/dp-auth/dist/$1",
  },
  testEnvironment: "jsdom",
};
