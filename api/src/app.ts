import express from 'express';
import cors from "cors";
import artifactRoutes from './infrastructure/http/artifact/routes';
import paperRoutes from './infrastructure/http/paper/routes';

const app = express();

app.use(cors({
  origin: "*", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/artifacts', artifactRoutes);
app.use('/papers', paperRoutes);

export default app;
