import express from 'express';
import {
    postLogin,
    postSignup,
    resendOtp,
    signupVerify,
} from '../controllers/userAuthControllers.js';
const router = express.Router();

router.post('/signUp', postSignup);
router.post('/verifySignup', signupVerify);
router.post('/resendSignupOtp', resendOtp)
router.post('/login', postLogin);

export default router;
