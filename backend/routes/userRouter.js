import express from 'express';
import {
    getUser,
    logout,
    postLogin,
    postSignup,
    resendOtp,
    signupVerify,
} from '../controllers/userAuthControllers.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = express.Router();

router.post('/signUp', postSignup);
router.post('/verifySignup', signupVerify);
router.post('/resendSignupOtp', resendOtp)
router.post('/login', postLogin);
router.post('/logout', logout);


router.get('/user',verifyUser,getUser)

export default router;
