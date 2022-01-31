module.exports = {
  extends: [
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react",
    "next",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["**/*generated.d.ts"],
  rules: {
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "allow-with-description",
      },
    ],
    "prettier/prettier": ["warn"],
  },
};
