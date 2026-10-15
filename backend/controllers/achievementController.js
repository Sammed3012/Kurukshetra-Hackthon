import { AchievementModel } from '../models/achievementModel.js';

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await AchievementModel.getAll();
    res.status(200).json({ success: true, count: achievements.length, data: achievements });
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  try {
    const { title, description, date } = req.body;
    
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'Please provide title, description, and date' });
    }
    
    const createdBy = req.user ? req.user.email : 'admin@soluper.com';
    
    const newAchievement = await AchievementModel.create({ title, description, date, createdBy });
    res.status(201).json({ success: true, data: newAchievement });
  } catch (error) {
    next(error);
  }
};
