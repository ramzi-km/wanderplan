import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';
import userModel from '../models/userModel.js';

export async function postAdminLogin(req, res) {
  try {
    const { email, password } = { ...req.body };
    if (!email || !password) {
      return res.status(401).json({ message: 'provide necessary information' });
    }
    const admin = await adminModel.findOne({ email: email });
    if (admin) {
      const comparison = await bcrypt.compare(password, admin.password);
      if (comparison) {
        const secret = process.env.JWT_SECRET_KEY_ADMIN;
        const token = jwt.sign({ _id: admin._id }, secret);
        res.cookie('adminToken', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
        });
        const data = await adminModel.findOne(
          { email: admin.email },
          { password: 0, __v: 0 }
        );
        return res.status(200).json({ admin: data });
      } else {
        res.status(400).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
}
export async function postAdminLogout(req, res) {
  try {
    res.status(200).json(req.admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAdminData(req, res) {
  try {
    res.cookie('adminToken', '', { maxAge: 0 });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
