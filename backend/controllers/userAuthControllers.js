import bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

//------------------helper-funcions-------------------//
import otpGenerator from 'otp-generator'
import { generateFromEmail } from 'unique-username-generator'
import { handleLoggedInUser } from '../helpers/handleLoggedInUser.js'
import sentForgotPassOtp from '../helpers/sentForgotPassOtp.js'
import sentOtp from '../helpers/sentOtp.js'

//-------------------models-------------------//
import tempUserModel from '../models/tempUserModel.js'
import userModel from '../models/userModel.js'

export async function postSignup(req, res) {
    try {
        const { fullName: name, email, username, mobile, password } = req.body
        if (!email || !password || !name || !mobile || !username) {
            return res
                .status(422)
                .json({ message: 'provide necessary information' })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const findEmail = await userModel.findOne({ email })
        const findUserName = await userModel.findOne({ username })
        const findUserName2 = await tempUserModel.findOne({ username })

        if (findEmail) {
            return res.status(403).json({ message: 'user already exists' })
        } else {
            if (findUserName || findUserName2) {
                return res
                    .status(403)
                    .json({ message: 'username already taken' })
            } else {
                const otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                })
                const tempUser = await tempUserModel.findOneAndUpdate(
                    { email },
                    {
                        $set: {
                            name,
                            email,
                            password: passwordHash,
                            username,
                            mobile,
                            'otpData.otp': otp,
                            'otpData.expirationTime':
                                Date.now() + 3 * 60 * 1000,
                        },
                    },
                    {
                        new: true,
                        upsert: true,
                    }
                )
                sentOtp(email, otp)
                const secret = process.env.JWT_SECRET_KEY
                const token = jwt.sign({ _id: tempUser._id }, secret)
                res.cookie('tempUserToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 8 * 1000 * 60,
                })
                return res.json({ message: 'otp sented successfully' })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function signupVerify(req, res) {
    try {
        const otp = req.body.otp
        const token = req.cookies.tempUserToken

        if (!token) {
            return res.status(401).json({ message: 'Please signup again' })
        }

        const secret = process.env.JWT_SECRET_KEY
        const decoded = jwt.verify(token, secret)

        const tempUser = await tempUserModel.findOne({ _id: decoded._id })

        if (
            otp == tempUser?.otpData.otp &&
            Date.now() < tempUser.otpData.expirationTime
        ) {
            const user = new userModel({
                name: tempUser.name,
                email: tempUser.email,
                password: tempUser.password,
                mobile: tempUser.mobile,
                username: tempUser.username,
            })
            await user.save()
            const email = user.email
            const result = await userModel.findOne(
                { email },
                {
                    _id: 0,
                    password: 0,
                    __v: 0,
                    ban: 0,
                }
            )
            await tempUserModel.findByIdAndDelete(tempUser.id)
            res.cookie('tempUserToken', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 0,
            })

            const secret = process.env.JWT_SECRET_KEY
            const token = jwt.sign({ _id: user._id }, secret)
            res.cookie('userToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 3 * 24 * 1000 * 60 * 60, // 3 day
            })
            return res.status(200).json({ user: result })
        } else {
            return res.status(403).json({ message: 'Invalid otp' })
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function resendOtp(req, res) {
    try {
        const token = req.cookies.tempUserToken

        if (!token) {
            return res.status(401).json({ message: 'Please signup again' })
        }

        const secret = process.env.JWT_SECRET_KEY
        const decoded = jwt.verify(token, secret)

        const tempUser = await tempUserModel.findOne({ _id: decoded._id })

        if (tempUser) {
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
                digits: true,
            })
            tempUser.otpData.otp = otp
            tempUser.otpData.expirationTime = Date.now() + 3 * 60 * 1000
            await tempUser.save()
            sentOtp(tempUser.email, otp)
            return res.status(200).json({ message: 'otp resent successfull' })
        } else {
            return res.status(400).json({ message: 'invalid request' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'internal server error' })
    }
}

export async function forgotPassword(req, res) {
    try {
        const email = req.body.email
        const user = await userModel.findOne({ email: email })
        if (user) {
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
                digits: true,
            })
            user.forgotPassOtp = {
                otp,
                expirationTime: Date.now() + 3 * 60 * 1000, // 3 minutes expiration time
            }
            await user.save()

            const secret = process.env.JWT_SECRET_KEY
            const token = jwt.sign({ _id: user._id }, secret)
            res.cookie('forgotPassUserToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 8 * 1000 * 60,
            })
            sentForgotPassOtp(email, otp)
            return res.json({ message: 'otp sented successfully' })
        } else {
            return res.status(404).json({ message: 'user not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function forgotPasswordVerify(req, res) {
    try {
        const otp = req.body.otp
        const token = req.cookies.forgotPassUserToken

        if (!token) {
            return res.status(401).json({ message: 'Please enter email again' })
        }

        const secret = process.env.JWT_SECRET_KEY
        const decoded = jwt.verify(token, secret)

        const forgotPassUser = await userModel.findOne({ _id: decoded._id })

        if (!forgotPassUser) {
            return res.status(403).json({ message: 'user not found' })
        }

        const forgotPassOtp = forgotPassUser.forgotPassOtp

        if (!forgotPassOtp) {
            return res.status(403).json({ message: 'provide email first' })
        }
        if (
            otp == forgotPassOtp?.otp &&
            Date.now() < forgotPassOtp.expirationTime
        ) {
            forgotPassUser.forgotPassOtp.verified = Date.now()
            await forgotPassUser.save()
            res.status(200).json({ message: 'success' })
        } else {
            res.status(403).json({ message: 'invalid otp' })
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function resetForgotPassword(req, res) {
    try {
        const password = req.body.password
        const token = req.cookies.forgotPassUserToken

        if (!token) {
            return res.status(401).json({ message: 'Please enter email again' })
        }

        const secret = process.env.JWT_SECRET_KEY
        const decoded = jwt.verify(token, secret)

        const forgotPassUser = await userModel.findOne({ _id: decoded._id })

        if (!forgotPassUser) {
            return res.status(403).json({ message: 'user not found' })
        }

        if (!password) {
            res.status(404).json({ message: 'provide password' })
        }
        const forgotPassOtp = forgotPassUser.forgotPassOtp
        if (forgotPassOtp) {
            console.log(forgotPassOtp.verified);
            if (forgotPassOtp.verified + 5 * 60 * 1000 > Date.now()) {
                const passwordHash = await bcrypt.hash(password, 10)
                await userModel.findOneAndUpdate(
                    { email: forgotPassUser.email },
                    { password: passwordHash }
                )
                forgotPassUser.forgotPassOtp = {}
                await forgotPassUser.save()
                res.status(200).json({ message: 'succes' })
            } else {
                res.status(403).json({ message: 'otp is not verified' })
            }
        } else {
            res.status(403).json({ message: 'provide email and otp first' })
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function postLogin(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res
                .status(422)
                .json({ message: 'provide necessary information' })
        }
        const user = await userModel.findOne({
            $or: [{ email: username }, { username: username }],
        })
        if (user) {
            if (!user.ban) {
                if (user.googleLogin && !user.password) {
                    return res.status(403).json({
                        message: 'Please use google sign in',
                    })
                } else {
                    const comparison = await bcrypt.compare(
                        password,
                        user.password
                    )
                    if (comparison) {
                        const secret = process.env.JWT_SECRET_KEY
                        const token = jwt.sign({ _id: user._id }, secret)
                        res.cookie('userToken', token, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            maxAge: 3 * 24 * 1000 * 60 * 60, // 3 day
                        })
                        const resUser = await userModel
                            .findOne({
                                email: user.email,
                            })
                            .select('-password')
                            .populate({
                                path: 'notifications',
                                populate: [
                                    {
                                        path: 'sender',
                                        model: 'User',
                                        select: 'name profilePic username _id',
                                    },
                                    {
                                        path: 'trip',
                                        model: 'Trip',
                                        select: 'name _id',
                                    },
                                ],
                            })
                            .exec()
                        return res.json({ user: resUser })
                    } else {
                        return res
                            .status(403)
                            .json({ message: 'Incorrect Password' })
                    }
                }
            } else {
                res.cookie('userToken', '', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 0,
                })
                res.status(403).json({ message: 'user is banned' })
            }
        } else {
            res.status(404).json({ message: 'user not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function postGoogleLogin(req, res) {
    try {
        const token = req.body.token
        const client = new OAuth2Client()
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload()
        if (payload.email_verified) {
            const { name, email, picture } = payload
            const user = await userModel
                .findOne({ email })
                .select('-password')
                .populate({
                    path: 'notifications',
                    populate: [
                        {
                            path: 'sender',
                            model: 'User',
                            select: 'name profilePic username _id',
                        },
                        {
                            path: 'trip',
                            model: 'Trip',
                            select: 'name _id',
                        },
                    ],
                })
                .exec()
            if (!user) {
                let username = ''
                let nameTaken = false
                do {
                    username = generateFromEmail(email, 3)
                    nameTaken = await userModel.findOne({
                        username: username,
                    })
                } while (nameTaken)
                const newUser = await userModel.create({
                    name,
                    email,
                    googleLogin: true,
                    profilePic: picture,
                    username,
                })
                return handleLoggedInUser(newUser, res)
            }
            if (!user.ban) {
                return handleLoggedInUser(user, res)
            } else {
                return res.status(403).json({ message: 'user is banned' })
            }
        } else {
            res.status(422).json({ message: 'google authentication failed' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function logout(req, res) {
    try {
        res.cookie('userToken', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
        })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
