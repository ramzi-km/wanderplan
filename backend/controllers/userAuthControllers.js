import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import otpGenerator from 'otp-generator';
import sentOtp from '../helpers/sentOtp.js';
import userModel from '../models/userModel.js';

export async function postSignup(req, res) {
  try {
    const { name, email, username, mobile, password } = req.body;
    if (!email || !password || !name || !mobile || !username) {
      return res.status(401).json({ message: 'provide necessary information' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const findEmail = await userModel.findOne({ email });
    const findUser = await userModel.findOne({ username });

    if (findEmail) {
      return res.status(403).json({ message: 'user already exists' });
    } else {
      if (findUser) {
        return res.status(403).json({ message: 'username already taken' });
      } else {
        const otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
          digits: true,
        });
        req.session.tempUser = {
          otp,
          userData: {
            name,
            email,
            password: passwordHash,
            username,
            mobile,
          },
          expirationTime: Date.now() + 3 * 60 * 1000, // 3 minutes expiration time
        };
        console.log(req.session);
        sentOtp(email, otp);
        return res.json({ message: 'otp sented successfully' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'internal server error' });
  }
}
export async function signupVerify(req, res) {
  try {
    const otp = req.body.otp;
    const tempUser = req.session.tempUser;
    if (otp == tempUser?.otp && Date.now() < tempUser.expirationTime) {
      const user = new userModel(tempUser.userData);
      await user.save();
      const email = user.email;
      const result = await userModel.findOne(
        { email },
        {
          _id: 0,
          password: 0,
        }
      );
      req.session.tempUser = null;
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ _id: user._id }, secret);
      res.cookie('userToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3 * 24 * 1000 * 60 * 60, // 7 day
      });
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: 'Invalid otp' });
    }
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
}

export async function resendOtp(req, res) {
  try {
    const tempUser = req.session.tempUser;
    if (tempUser) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      tempUser.otp = otp;
      tempUser.expirationTime = Date.now() + 3 * 60 * 1000; // 3 minutes expiration time
      sentOtp(tempUser.userData.email, otp);
    } else {
      res.status(400).json({ message: 'invalid request' });
    }
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
}

export async function forgotPassword(req, res) {
  try {
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
}

export async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: 'provide necessary information' });
    }
    const user = await userModel.findOne({ email }, { password: 0, ban: 0 });
    if (user) {
      const comparison = await bcrypt.compare(password, user.password);
      if (comparison) {
        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ _id: user._id }, secret);
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 3 * 24 * 1000 * 60 * 60, // 3 day
        });
        return res.json(user);
      } else {
        res.status(400).json({ message: 'Incorrect Password' });
      }
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'internal server error' });
  }
}
