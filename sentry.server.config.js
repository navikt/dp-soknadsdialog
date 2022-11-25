import * as Sentry from "@sentry/nextjs";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENV = publicRuntimeConfig.NEXT_PUBLIC_SENTRY_ENV || "development";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  environment: SENTRY_ENV,
});
