import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import sentOtp from '../helpers/sentOtp.js'
import userModel from '../models/userModel.js'

export async function postSignup(req, res) {
    try {
        const { fullName: name, email, username, mobile, password } = req.body
        if (!email || !password || !name || !mobile || !username) {
            return res
                .status(401)
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
        console.log(req.session)
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
            return res.status(400).json({ message: 'Invalid otp' })
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
        console.log('reset password')
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function postLogin(req, res) {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res
                .status(401)
                .json({ message: 'provide necessary information' })
        }
        const user = await userModel.findOne(
            {
                $or: [{ email: username }, { username: username }],
            },
            { ban: 0 }
        )
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
                        { ban: 0, password: 0, __v: 0 }
                    )
                    return res.json({ user: resUser })
                } else {
                    res.status(400).json({ message: 'Incorrect Password' })
                }
            } else {
                res.status(403).json({ message: 'user is banned' })
            }
        } else {
            res.status(404).json({ message: 'user not found' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function getUser(req, res) {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function logout(req, res) {
    res.cookie('userToken', '', { maxAge: 0 })
    res.status(200).json({ message: 'success' })
}
