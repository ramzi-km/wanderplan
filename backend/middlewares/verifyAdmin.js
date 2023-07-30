import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';

export default async function verifyAdmin(req, res, next) {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided.' });
    }

    const secret = process.env.JWT_SECRET_KEY_ADMIN;
    const decoded = jwt.verify(token, secret);

    // Check if the decoded user ID exists in the database
    const admin = await adminModel.findOne(
      { _id: decoded._id },
      { password: 0, __v: 0 }
    );
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
