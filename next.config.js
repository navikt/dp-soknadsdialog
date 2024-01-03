/* eslint-disable @typescript-eslint/no-var-requires */
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
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'", "rt6o382n.apicdn.sanity.io"],
};

/**
 * @type {import("next").NextConfig}
 */
const config = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  i18n: {
    locales: supportedLocales,
    defaultLocale: "nb",
  },
  assetPrefix: process.env.ASSET_PREFIX,
  experimental: {
    largePageDataBytes: 256 * 1000, // Økt fra 128KB til 256K
    // Enable OpenTelemetry instrumentation for Next.js
    // https://nextjs.org/docs/pages/building-your-application/optimizing/open-telemetry
    instrumentationHook: true,
  },
  output: "standalone",
  swcMinify: true,
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

module.exports = withBundleAnalyzer(config);
