const withReactSvg = require("next-react-svg");
const path = require("path");

const navFrontendModuler = Object.keys(
  require("./package.json").dependencies
).filter((it) => it.startsWith("nav-"));

const withTranspileModules = require("next-transpile-modules")(
  navFrontendModuler
);

module.exports = withTranspileModules(
  withReactSvg({
    include: path.resolve(__dirname, "assets/svg"),
    reactStrictMode: true,
    basePath: process.env.BASE_PATH,
    eslint: {
      ignoreDuringBuilds: true
    }
  })
);
