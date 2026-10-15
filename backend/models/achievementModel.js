import { readSheet, writeSheet } from '../config/excel.js';

export const AchievementModel = {
  getAll: async () => {
    return readSheet('Achievements');
  },
  
  getById: async (id) => {
    const achievements = readSheet('Achievements');
    return achievements.find(a => String(a.id) === String(id));
  },
  
  create: async (achievementData) => {
    const achievements = readSheet('Achievements');
    const newId = achievements.length > 0 ? String(Math.max(...achievements.map(a => parseInt(a.id) || 0)) + 1) : "1";
    
    const newAchievement = {
      id: newId,
      title: achievementData.title,
      description: achievementData.description,
      date: achievementData.date,
      createdBy: achievementData.createdBy || 'admin@soluper.com'
    };
    
    achievements.push(newAchievement);
    writeSheet('Achievements', achievements);
    return newAchievement;
  }
};
