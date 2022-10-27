/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// TODO: Denne bør deles med _document.tsx
const supportedLocales = ["nb", "en"];

const config = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  i18n: {
    locales: supportedLocales,
    defaultLocale: "nb",
  },
  output: "standalone",
  publicRuntimeConfig: {
    NEXT_PUBLIC_SENTRY_STAGE: process.env.NEXT_PUBLIC_SENTRY_STAGE,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(config, {
    silent: true,
    errorHandler: (err, invokeErr, compilation) => {
      compilation.warnings.push("Sentry CLI Plugin: " + err.message);
    },
  })
);
