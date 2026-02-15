import { Router } from 'express';
import { ArtifactController } from './Controller';

const router = Router();

router.get('/', ArtifactController.list);

export default router;
