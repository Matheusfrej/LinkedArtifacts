import { Router } from 'express';
import { PaperController } from './Controller';

const router = Router();

router.get('/', PaperController.list);
router.post('/by-titles', PaperController.listByTitles);

export default router;
