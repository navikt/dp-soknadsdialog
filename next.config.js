/* eslint-disable @typescript-eslint/no-var-requires */
const withReactSvg = require("next-react-svg");
const path = require("path");

module.exports = withReactSvg({
  include: path.resolve(__dirname, "assets/svg"),
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  publicRuntimeConfig: {
    DEKORATOR_ENV: process.env.DEKORATOR_ENV,
  },
});
