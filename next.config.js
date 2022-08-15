/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");
const withReactSvg = require("next-react-svg");
const path = require("path");

// TODO: Denne bør deles med _document.tsx
const supportedLocales = ["nb", "nn", "en"];

const config = withReactSvg({
  include: path.resolve(__dirname, "assets/svg"),
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  i18n: {
    locales: supportedLocales,
    defaultLocale: "nb",
  },
});

module.exports = withSentryConfig(config, {
  silent: false,
});
