import client from "prom-client";
import  { NextFunction, Request, Response ,Express } from "express";
 

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 500, 1000, 2000, 5000],
});

export const tourbookingCounter = new client.Counter({
  name: "tour_bookings_total",
  help: "Total number of tour packages booked via Razorpay",
  labelNames: ["package_id", "status"],
});
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(tourbookingCounter);

export const setupPromethues=(app:Express)=>{
  app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
  });
  next();
});

app.get("/metrics", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

}