import promClient from 'prom-client'

// Register metrics
export const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

export const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

export const redisRequestDuration = new promClient.Histogram({
  name: "redis_request_duration_seconds",
  help: "Duration of Redis commands",
  labelNames: ["command"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1],
});

export const redisRequestsTotal = new promClient.Counter({
  name: "redis_requests_total",
  help: "Total number of Redis commands",
  labelNames: ["command", "status"],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(redisRequestDuration);
register.registerMetric(redisRequestsTotal);