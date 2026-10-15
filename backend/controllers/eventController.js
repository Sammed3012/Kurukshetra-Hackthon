import { EventModel } from '../models/eventModel.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = await EventModel.getAll();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, date } = req.body;
    
    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: 'Please provide title, description, and date' });
    }
    
    const createdBy = req.user ? req.user.email : 'admin@soluper.com';
    
    const newEvent = await EventModel.create({ title, description, date, createdBy });
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    next(error);
  }
};
