import { Router } from 'express';
import { PaperController } from './Controller';

const router = Router();

router.get('/', PaperController.list);
router.post('/by-names', PaperController.listByNames);

export default router;
