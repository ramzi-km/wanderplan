import express from 'express'
const router = express.Router()

//---------------middlewares-----------------//

import verifyUser from '../middlewares/verifyUser.js'

//--------------controllers-----------------//

//---------user-auth-controllers---//
import {
    logout,
    postLogin,
    postSignup,
    resendOtp,
    signupVerify,
} from '../controllers/userAuthControllers.js'

//--------user-controllers-------//

import {
    getAllTrips,
    getRecentAndUpcomingTrips,
    getUser,
    updateUser,
    uploadProfile,
} from '../controllers/userControllers.js'

//------tripPlanConrollers--------//

import { addNewTrip } from '../controllers/tripPlanControllers.js'

//----------------------------------------------//

//------------user-auth------------------//

router.post('/signUp', postSignup)
router.post('/verifySignup', signupVerify)
router.post('/resendSignupOtp', resendOtp)
router.post('/login', postLogin)
router.post('/logout', logout)

//----------user-profile------------------//

router.get('/user', verifyUser, getUser)
router.patch('/user', verifyUser, updateUser)
router.post('/user/uploadProfile', verifyUser, uploadProfile)

router.get('/user/getRecentTrips', verifyUser, getRecentAndUpcomingTrips)
router.get('/user/getAllTrips', verifyUser, getAllTrips)

//----------user-trip-plans-----------------//
router.post('/trip/create', verifyUser, addNewTrip)

export default router
