import express from 'express';
import { getEvents, createEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin'), createEvent);

export default router;
