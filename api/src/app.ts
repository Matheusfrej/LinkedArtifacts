import express from 'express';
import artifactRoutes from './infrastructure/http/artifact/routes';
import paperRoutes from './infrastructure/http/paper/routes';

const app = express();

app.use(express.json());

app.use('/api/artifacts', artifactRoutes);
app.use('/api/papers', paperRoutes);

export default app;
