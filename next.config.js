const withReactSvg = require("next-react-svg");
const path = require("path");
const { availableLocales } = require("./lib/i18n/availableLocales");

module.exports = withReactSvg({
  include: path.resolve(__dirname, "assets/svg"),
  reactStrictMode: true,
  basePath: process.env.BASE_PATH,
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: availableLocales,
    defaultLocale: "nb",
    localeDetection: false,
  },
});
