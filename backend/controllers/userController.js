import bcrypt from 'bcryptjs';
import { UserModel } from '../models/userModel.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAll();
    const safeUsers = users.map(u => {
      const userObj = { ...u };
      delete userObj.password;
      return userObj;
    });
    res.status(200).json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Please provide name and email' });
    }
    
    // Check if user already exists
    const existingUser = await UserModel.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }
    
    const plainPassword = password || 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    const newUser = await UserModel.create({ name, email, password: hashedPassword, role });
    
    const safeNewUser = { ...newUser };
    delete safeNewUser.password;
    
    res.status(201).json({ success: true, data: safeNewUser });
  } catch (error) {
    next(error);
  }
};
