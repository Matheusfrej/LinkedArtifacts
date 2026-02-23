import express from 'express';
import cors from "cors";
import { errorHandler } from './middleware/errorHandler';
import { register } from '../prometheus/config';
import { requestDurationMetric } from './middleware/requestDurationMetric';
import { connectRedis } from '../redis/config';
import { Server } from '../../application/Server';
import { Express } from 'express-serve-static-core';
import { PaperController } from './paper/Controller';
import { ArtifactUseCaseFactory } from '../../application/factories/use-cases/ArtifactUseCaseFactory';
import { PaperUseCaseFactory } from '../../application/factories/use-cases/PaperUseCaseFactory';
import { ArtifactController } from './artifact/Controller';

export class ExpressApiServer implements Server {
  private readonly app: Express;
  private readonly PORT: number;
  constructor(
    artifactUseCaseFactory: ArtifactUseCaseFactory, 
    paperUseCaseFactory: PaperUseCaseFactory
  ) {
    this.app = express()
    this.PORT = Number(process.env.PORT) || 4000;

    this.app.use(cors({
      origin: "*", // frontend
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }));

    this.app.use(express.json());

    // Middleware for measuring request duration
    this.app.use(requestDurationMetric)

    const artifactController = new ArtifactController(artifactUseCaseFactory)
    const paperController = new PaperController(paperUseCaseFactory)

    this.app.use('/artifacts', artifactController.getRouter());
    this.app.use('/papers', paperController.getRouter());

    // Prometheus metrics endpoint
    this.app.get("/metrics", async (req, res) => {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    });

    // Error middleware must be the last middleware
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    await connectRedis();

    this.app.listen(this.PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${this.PORT}`);
    });
  }
  
}