/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs");
const { buildCspHeader } = require("@navikt/nav-dekoratoren-moduler/ssr");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// TODO: Denne bør deles med _document.tsx
// TODO: Legg til "en" når vi får alle tekster inn i Sanity;
const supportedLocales = ["nb"];

// Direktiver appen din benytter
const myAppDirectives = {
  "script-src-elem": ["'self'"],
  "img-src": ["'self'"],
  "connect-src": ["'self'"],
  "report-uri":
    "https://sentry.gc.nav.no/api/138/security/?sentry_key=1d4d9592b0c4442889ba64e028a16c09",
};

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
  async headers() {
    const env = process.env.NEXT_PUBLIC_LOCALHOST !== "true" ? "prod" : "dev";
    const csp = await buildCspHeader(myAppDirectives, { env });
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

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
