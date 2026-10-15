import { readSheet, writeSheet } from '../config/excel.js';

export const EventModel = {
  getAll: async () => {
    return readSheet('Events');
  },
  
  getById: async (id) => {
    const events = readSheet('Events');
    return events.find(e => String(e.id) === String(id));
  },
  
  create: async (eventData) => {
    const events = readSheet('Events');
    const newId = events.length > 0 ? String(Math.max(...events.map(e => parseInt(e.id) || 0)) + 1) : "1";
    
    const newEvent = {
      id: newId,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      createdBy: eventData.createdBy || 'admin@soluper.com'
    };
    
    events.push(newEvent);
    writeSheet('Events', events);
    return newEvent;
  }
};
