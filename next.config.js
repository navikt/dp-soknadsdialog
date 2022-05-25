/* eslint-disable @typescript-eslint/no-var-requires */
const withReactSvg = require("next-react-svg");
const path = require("path");

module.exports = withReactSvg({
  include: path.resolve(__dirname, "assets/svg"),
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  i18n: {
    locales: ["nb", "nn", "en"],
    defaultLocale: "nb",
  },
});
