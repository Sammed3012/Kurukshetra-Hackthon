import express from 'express';
import { getAchievements, createAchievement } from '../controllers/achievementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, authorize('admin'), createAchievement);

export default router;
