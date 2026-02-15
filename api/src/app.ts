import express from 'express';
import artifactRoutes from './infrastructure/http/routes/artifactRoutes';

const app = express();

app.use(express.json());

app.use('/api/artifacts', artifactRoutes);

export default app;
