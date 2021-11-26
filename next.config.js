const withReactSvg = require("next-react-svg");
const path = require("path");
const { availableLocales } = require("./src/lib/i18n/available-locales");

module.exports = withReactSvg({
  include: path.resolve(__dirname, "assets/svg"),
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: availableLocales,
    defaultLocale: "nb",
    localeDetection: false,
  },
});
