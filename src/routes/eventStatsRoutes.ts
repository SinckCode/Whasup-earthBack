import { Router } from 'express';
import { getEventStats, recordView } from '../controllers/eventStatsController';

const router = Router();

router.get('/:eventId', getEventStats);
router.post('/:eventId/view', recordView);

export default router;
