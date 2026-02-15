import { Router } from 'express';
import { ArtifactController } from '../controllers/ArtifactController';

const router = Router();

router.get('/', ArtifactController.list);

export default router;
