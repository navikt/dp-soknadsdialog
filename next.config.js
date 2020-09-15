const withLess = require("@zeit/next-less");
const withReactSvg = require("next-react-svg");
const path = require("path");

const navFrontendModuler = Object.keys(
  require("./package.json").dependencies
).filter((it) => it.startsWith("nav-frontend"));

const withTranspileModules = require("next-transpile-modules")(
  navFrontendModuler
);

module.exports = withTranspileModules(
  withLess(
    withReactSvg({
      include: path.resolve(__dirname, "assets/svg"),
    })
  )
);
