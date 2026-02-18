import promClient from 'prom-client'

// Register metrics
export const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metric (HTTP request duration)
export const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestDuration);