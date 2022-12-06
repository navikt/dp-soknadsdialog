require("next");
import "@testing-library/jest-dom";

// To fix ResizeObserver is not defined error
// https://github.com/ZeeCoder/use-resize-observer/issues/40

global.ResizeObserver = require("resize-observer-polyfill");

jest.mock("uuid", () => {
  return {
    v4: () => "localhost-uuid",
  };
});

jest.mock("next/router", () => {
  return {
    useRouter: () => ({
      locale: "no",
      query: {
        uuid: "localhost-uuid",
      },
    }),
  };
});
