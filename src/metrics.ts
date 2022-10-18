import { collectDefaultMetrics, Counter, Histogram } from "prom-client";

declare global {
  // eslint-disable-next-line no-var
  var _metrics: AppMetrics;
}

export class AppMetrics {
  constructor() {
    collectDefaultMetrics();
  }

  public backendApiDurationHistogram = new Histogram({
    name: "dp_soknadsdialog_requests_duration_seconds",
    help: "Load time for API call to dp-soknad",
    labelNames: ["path"],
  });
  public pageInitialLoadCounter = new Counter({
    name: "dp_soknadsdialog_request_counter",
    help: "Number of requests",
    labelNames: ["path"],
  });
  public apiUnauthorized = new Counter({
    name: "dp_soknadsdialog_api_unauthorized_counter",
    help: "Requests to API routes that are unauthorized",
    labelNames: ["path"],
  });
  public pageError = new Counter({
    name: "dp_soknadsdialog_page_error",
    help: "Page error counts, 500, 404, etc",
    labelNames: ["type", "path"],
  });
}

export type ClientMetrics =
  | { type: "500" }
  | { type: "404"; path: string }
  | { type: "boundary"; path: string }
  | { type: "info-page"; path: string };

global._metrics = global._metrics || new AppMetrics();

export default global._metrics;
