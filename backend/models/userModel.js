import { readSheet, writeSheet } from '../config/excel.js';

export const UserModel = {
  getAll: async () => {
    return readSheet('Users');
  },
  
  getById: async (id) => {
    const users = readSheet('Users');
    return users.find(u => String(u.id) === String(id));
  },
  
  getByEmail: async (email) => {
    const users = readSheet('Users');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  create: async (userData) => {
    const users = readSheet('Users');
    const newId = users.length > 0 ? String(Math.max(...users.map(u => parseInt(u.id) || 0)) + 1) : "1";
    
    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user'
    };
    
    users.push(newUser);
    writeSheet('Users', users);
    return newUser;
  }
};
