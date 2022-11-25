import { collectDefaultMetrics, Counter, Histogram, linearBuckets } from "prom-client";

declare global {
  // eslint-disable-next-line no-var
  var _metrics: AppMetrics;
}

export class AppMetrics {
  constructor() {
    collectDefaultMetrics();
  }

  public tokenExchangeDurationHistogram = new Histogram({
    name: "dp_soknadsdialog_token_exchange_duration_seconds",
    help: "Time spent doing token exchange against tokenX",
  });
  public backendApiDurationHistogram = new Histogram({
    name: "dp_soknadsdialog_requests_duration_seconds",
    help: "Load time for API call to dp-soknad",
    labelNames: ["path"],
  });
  public filOpplastetStørrelse = new Histogram({
    name: "dp_soknadsdialog_file_upload_bytes",
    help: "Størrelse på filer som lastes opp",
    buckets: linearBuckets(1000000, 1000000, 20),
  });
  public filOpplastetFeilet = new Histogram({
    name: "dp_soknadsdialog_file_upload_bytes_failed",
    help: "Størrelse på filer som ikke lastes opp",
    buckets: linearBuckets(1000000, 1000000, 20),
  });
  public bundleStørrelse = new Histogram({
    name: "dp_soknadsdialog_file_bundle_bytes",
    help: "Størrelse på bundles som lages",
    buckets: linearBuckets(1000000, 1000000, 20),
  });
  public bundleTidBrukt = new Histogram({
    name: "dp_soknadsdialog_file_bundle_seconds",
    help: "Tid brukt på bundling",
  });
  public bundleAntallFiler = new Histogram({
    name: "dp_soknadsdialog_file_bundle_files",
    help: "Antall filer i hver bundle",
    buckets: linearBuckets(1, 1, 20),
  });
  public bundleFeil = new Counter({
    name: "dp_soknadsdialog_bundle_failed",
    help: "Sammensetting av bundle feilet",
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
