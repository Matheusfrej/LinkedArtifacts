import { Router } from 'express';
import { PaperController } from './Controller';

const router = Router();

router.get('/', PaperController.list);

export default router;
