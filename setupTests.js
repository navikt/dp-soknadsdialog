import dotenv from "dotenv/config";
import "@testing-library/jest-dom/extend-expect";
import "next/dist/next-server/server/node-polyfill-fetch";
import { server } from "./__mocks__/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
