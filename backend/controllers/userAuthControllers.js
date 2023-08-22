import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import sentForgotPassOtp from '../helpers/sentForgotPassOtp.js'
import sentOtp from '../helpers/sentOtp.js'
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
        const findUser = await userModel.findOne({ username })

        if (findEmail) {
            return res.status(403).json({ message: 'user already exists' })
        } else {
            if (findUser) {
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
                }
                sentOtp(email, otp)
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
        const tempUser = req.session.tempUser
        if (otp == tempUser?.otp && Date.now() < tempUser.expirationTime) {
            const user = new userModel(tempUser.userData)
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
            req.session.tempUser = null
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
        const tempUser = req.session.tempUser
        console.log(req.session)
        if (tempUser) {
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
                digits: true,
            })
            tempUser.otp = otp
            tempUser.expirationTime = Date.now() + 3 * 60 * 1000 // 3 minutes expiration time
            sentOtp(tempUser.userData.email, otp)
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
            req.session.forgotPassOtp = {
                otp,
                email,
                expirationTime: Date.now() + 3 * 60 * 1000, // 3 minutes expiration time
                verified: false,
            }
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
        console.log(otp)
        const forgotPassOtp = req.session.forgotPassOtp
        if (!forgotPassOtp) {
            return res.status(403).json({ message: 'provide email first' })
        }
        if (
            otp == forgotPassOtp?.otp &&
            Date.now() < forgotPassOtp.expirationTime
        ) {
            const email = forgotPassOtp.email
            const user = await userModel.findOne({ email })
            if (!user) {
                res.status(403).json({ message: 'provide email first' })
            } else {
                req.session.forgotPassOtp.verified = true
                res.status(200).json({ message: 'success' })
            }
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
        if (!password) {
            res.status(404).json({ message: 'provide password' })
        }
        const forgotPassOtp = req.session.forgotPassOtp
        if (forgotPassOtp) {
            if (forgotPassOtp.verified) {
                const passwordHash = await bcrypt.hash(password, 10)
                await userModel.findOneAndUpdate(
                    { email: forgotPassOtp.email },
                    { password: passwordHash }
                )
                req.session.forgotPassOtp = null
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
                const comparison = await bcrypt.compare(password, user.password)
                if (comparison) {
                    const secret = process.env.JWT_SECRET_KEY
                    const token = jwt.sign({ _id: user._id }, secret)
                    res.cookie('userToken', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 3 * 24 * 1000 * 60 * 60, // 3 day
                    })
                    const resUser = await userModel.findOne(
                        {
                            email: user.email,
                        },
                        { password: 0, __v: 0 }
                    )
                    return res.json({ user: resUser })
                } else {
                    res.status(403).json({ message: 'Incorrect Password' })
                }
            } else {
                res.cookie('userToken', '', { maxAge: 0 })
                res.status(403).json({ message: 'user is banned' })
            }
        } else {
            res.status(404).json({ message: 'user not found' })
        }
    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function logout(req, res) {
    try {
        res.cookie('userToken', '', { maxAge: 0, httpOnly: true })
        res.status(200).json({ message: 'success' })
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
