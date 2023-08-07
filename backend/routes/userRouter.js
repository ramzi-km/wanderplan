import express from 'express'
import {
    logout,
    postLogin,
    postSignup,
    resendOtp,
    signupVerify,
} from '../controllers/userAuthControllers.js'
import { getUser, updateUser } from '../controllers/userControllers.js'
import verifyUser from '../middlewares/verifyUser.js'
const router = express.Router()

router.post('/signUp', postSignup)
router.post('/verifySignup', signupVerify)
router.post('/resendSignupOtp', resendOtp)
router.post('/login', postLogin)
router.post('/logout', logout)

router.get('/user', verifyUser, getUser)
router.patch('/user', verifyUser, updateUser)

export default router
