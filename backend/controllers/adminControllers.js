import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';
import userModel from '../models/userModel.js';

export async function getAllUsers(req, res) {
  try {
    const users =await userModel.find({}, { password: 0, __v: 0 });
    res.status(200).json({ users: users, message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error, message: 'Internal server error' });
  }
}
