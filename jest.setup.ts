require("next");
import "@testing-library/jest-dom";

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
