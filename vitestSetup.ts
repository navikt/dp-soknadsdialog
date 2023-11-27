import { beforeAll, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("uuid", () => {
  return {
    v4: () => "localhost-uuid",
  };
});

beforeAll(() => {
  vi.mock("next/router", () => {
    return {
      useRouter: () => ({
        locale: "no",
        query: {
          uuid: "localhost-uuid",
        },
        push: vi.fn(),
      }),
    };
  });
});
