import express from 'express';
import cors from "cors";
import artifactRoutes from './artifact/routes';
import paperRoutes from './paper/routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: "*", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/artifacts', artifactRoutes);
app.use('/papers', paperRoutes);

// Error middleware must be the last middleware
app.use(errorHandler);

export default app;
