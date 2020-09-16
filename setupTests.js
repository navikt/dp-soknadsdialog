import "@testing-library/jest-dom/extend-expect";
import "next/dist/next-server/server/node-polyfill-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
