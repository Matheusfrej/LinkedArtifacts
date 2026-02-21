import express from 'express';
import cors from "cors";
import artifactRoutes from './artifact/routes';
import paperRoutes from './paper/routes';
import { errorHandler } from './middleware/errorHandler';
import { register } from '../prometheus/config';
import { requestDurationMetric } from './middleware/requestDurationMetric';
import { connectRedis } from '../redis/config';

const app = express();

app.use(cors({
  origin: "*", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Middleware for measuring request duration
app.use(requestDurationMetric)

app.use('/artifacts', artifactRoutes);
app.use('/papers', paperRoutes);

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Error middleware must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

export async function bootstrap() {
  await connectRedis();

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
