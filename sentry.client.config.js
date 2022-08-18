import * as Sentry from "@sentry/nextjs";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_STAGE = publicRuntimeConfig.NEXT_PUBLIC_SENTRY_STAGE || "";

/* eslint-disable no-console*/
console.log("SENTRY_STAGE:", SENTRY_STAGE);

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: SENTRY_STAGE,
});
