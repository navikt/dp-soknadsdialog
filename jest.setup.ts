require("next");
import "@testing-library/jest-dom/extend-expect";
import { server } from "./src/lib/mocks/server";


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
