import express from 'express'
const router = express.Router()

//---------------middlewares-----------------//

import verifyUser from '../middlewares/verifyUser.js'

//--------------controllers-----------------//

//---------user-auth-controllers---//
import {
    forgotPassword,
    forgotPasswordVerify,
    logout,
    postGoogleLogin,
    postLogin,
    postSignup,
    resendOtp,
    resetForgotPassword,
    signupVerify,
} from '../controllers/userAuthControllers.js'

//--------user-controllers-------//

import {
    getAllTrips,
    getRecentAndUpcomingTrips,
    getUser,
    resetPassword,
    updateUser,
    uploadProfile,
} from '../controllers/userControllers.js'

//------tripPlanConrollers--------//

import {
    addNewTrip,
    getTripDetails,
} from '../controllers/tripPlanControllers.js'

//----------------------------------------------//

//------------user-auth------------------//

router.post('/signUp', postSignup)
router.post('/verifySignup', signupVerify)
router.post('/resendSignupOtp', resendOtp)
router.post('/forgotPassword', forgotPassword)
router.post('/forgotPasswordVerify', forgotPasswordVerify)
router.patch('/resetForgotPassword', resetForgotPassword)
router.post('/login', postLogin)
router.post('/googleLogin', postGoogleLogin)
router.post('/logout', logout)

//----------user-profile------------------//

router.get('/user', verifyUser, getUser)
router.patch('/user', verifyUser, updateUser)
router.post('/user/uploadProfile', verifyUser, uploadProfile)
router.patch('/resetPassword', verifyUser, resetPassword)

router.get('/user/getRecentTrips', verifyUser, getRecentAndUpcomingTrips)
router.get('/user/getAllTrips', verifyUser, getAllTrips)

//----------user-trip-plans-----------------//
router.post('/trip/create', verifyUser, addNewTrip)
router.get('/trip/getDetails/:id', verifyUser, getTripDetails)

export default router
