import express from 'express'
const router = express.Router()

//---------------middlewares-----------------//

import verifyTripAdmin from '../middlewares/verifyTripAdmin.js'
import verifyTripMate from '../middlewares/verifyTripMate.js'
import verifyUser from '../middlewares/verifyUser.js'

//-------------------------controllers------------------------------//

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
    acceptTripInvitation,
    getAllGuides,
    getAllTrips,
    getUpcomingTrips,
    getUser,
    resetPassword,
    searchUsers,
    updateUser,
    uploadProfile,
} from '../controllers/userControllers.js'

//------------tripPlanConrollers-------------//

import {
    addPlaceToVisit,
    changeCoverPhoto,
    changePlaceToVisitPhoto,
    changeTripName,
    changeTripVisibility,
    createNewTrip,
    deletePlaceToVisit,
    deleteTrip,
    getTripDetails,
    inviteTripMate,
    leaveTrip,
    removeTripMate,
    updateDescription,
    updateNotes,
    updatePlaceToVisitDescription,
} from '../controllers/tripPlanControllers.js'

//------------itinerary-management-controllers-------------//

import {
    addPlace,
    deleteItineraryPlace,
    updatePlaceDescription,
    updatePlaceImage,
    updatePlaceNotes,
    updatePlaceTime,
    updateSubheading,
} from '../controllers/itineraryManagementControllers.js'

//------------budget-management-controllers-------------//

import {
    addExpense,
    deleteExpense,
    getAllExpenseCategories,
    setBudget,
} from '../controllers/budgetMangagementControllers.js'
import {
    createMessage,
    getAllMessagesForRoom,
} from '../controllers/chatControllers.js'

//---------------------------guide-controllers------------------------//

import {
    createNewGuide,
    getEditGuideDetails,
} from '../controllers/guideControllers.js'
import verifyGuideWriter from '../middlewares/verifyGuideWriter.js'

//-------------------------------------------------------------------------//

//----------------------user-auth-----------------------//

router.post('/signUp', postSignup)
router.post('/verifySignup', signupVerify)
router.post('/resendSignupOtp', resendOtp)
router.post('/forgotPassword', forgotPassword)
router.post('/forgotPasswordVerify', forgotPasswordVerify)
router.patch('/resetForgotPassword', resetForgotPassword)
router.post('/login', postLogin)
router.post('/googleLogin', postGoogleLogin)
router.post('/logout', logout)

//----------------------user-profile-------------------//

router.get('/user/search', verifyUser, searchUsers)

router.get('/user', verifyUser, getUser)
router.patch('/user', verifyUser, updateUser)
router.post('/user/uploadProfile', verifyUser, uploadProfile)
router.patch('/user/resetPassword', verifyUser, resetPassword)

router.get('/user/upcomingTrips', verifyUser, getUpcomingTrips)
router.get('/user/getAllTrips', verifyUser, getAllTrips)
router.get('/user/getAllGuides', verifyUser, getAllGuides)
router.post(
    '/user/acceptTripInvitation/:tripId/:notificationId',
    verifyUser,
    acceptTripInvitation
)

//--------------------user-trip-plans--------------------//

router.post('/trip/create', verifyUser, createNewTrip)
router.get('/trip/:id/editTrip', verifyUser, verifyTripMate, getTripDetails)
router.post(
    '/trip/:id/inviteTripmate',
    verifyUser,
    verifyTripAdmin,
    inviteTripMate
)
router.delete(
    '/trip/:id/removeTripmate/:tripMateId',
    verifyUser,
    verifyTripAdmin,
    removeTripMate
)
router.delete('/trip/:id/leaveTrip', verifyUser, verifyTripMate, leaveTrip)
router.patch('/trip/edit/name/:id', verifyUser, verifyTripMate, changeTripName)
router.patch(
    '/trip/:id/visibility',
    verifyUser,
    verifyTripMate,
    changeTripVisibility
)
router.patch(
    '/trip/edit/coverPhoto/:id',
    verifyUser,
    verifyTripMate,
    changeCoverPhoto
)
router.patch(
    '/trip/edit/overview/description/:id',
    verifyUser,
    verifyTripMate,
    updateDescription
)
router.patch(
    '/trip/edit/overview/notes/:id',
    verifyUser,
    verifyTripMate,
    updateNotes
)
router.put(
    '/trip/edit/overview/placesToVisit/addPlace/:id',
    verifyUser,
    verifyTripMate,
    addPlaceToVisit
)
router.patch(
    '/trip/edit/:id/overview/placesToVisit/changePhoto/:placeIndex',
    verifyUser,
    verifyTripMate,
    changePlaceToVisitPhoto
)
router.patch(
    '/trip/edit/:id/overview/placesToVisit/updateDescription/:placeIndex',
    verifyUser,
    verifyTripMate,
    updatePlaceToVisitDescription
)
router.delete(
    '/trip/edit/:id/overview/placesToVisit/deletePlace/:placeIndex',
    verifyUser,
    verifyTripMate,
    deletePlaceToVisit
)
router.delete('/trip/:id', verifyUser, verifyTripAdmin, deleteTrip)

//------------------itinerary-management-------------------//
router.patch(
    '/trip/edit/:id/itinerary/:itineraryIndex/subheading',
    verifyUser,
    verifyTripMate,
    updateSubheading
)
router.post(
    '/trip/:id/itinerary/:itineraryId/place',
    verifyUser,
    verifyTripMate,
    addPlace
)
router.patch(
    '/trip/:id/itinerary/:dayIndex/place/:placeIndex/description',
    verifyUser,
    verifyTripMate,
    updatePlaceDescription
)
router.patch(
    '/trip/:id/itinerary/:dayIndex/place/:placeIndex/note',
    verifyUser,
    verifyTripMate,
    updatePlaceNotes
)
router.patch(
    '/trip/:id/itinerary/:dayIndex/place/:placeIndex/image',
    verifyUser,
    verifyTripMate,
    updatePlaceImage
)
router.patch(
    '/trip/:id/itinerary/:dayIndex/place/:placeIndex/time',
    verifyUser,
    verifyTripMate,
    updatePlaceTime
)

router.delete(
    '/trip/:id/itinerary/:dayIndex/place/:placeIndex',
    verifyUser,
    verifyTripMate,
    deleteItineraryPlace
)

//------------------budget-management-------------------//

router.get(
    '/trip/budget/expenseCategories',
    verifyUser,
    getAllExpenseCategories
)
router.post('/trip/:id/budget/expense', verifyUser, verifyTripMate, addExpense)
router.delete(
    '/trip/:id/budget/expense/:expenseId',
    verifyUser,
    verifyTripMate,
    deleteExpense
)
router.post('/trip/:id/budget/limit', verifyUser, verifyTripMate, setBudget)

//----------------------------group-chat-------------------------------------//

router.post('/trip/:id/chat/message', verifyUser, verifyTripMate, createMessage)
router.get(
    '/trip/:id/chat/messages',
    verifyUser,
    verifyTripMate,
    getAllMessagesForRoom
)

//---------------------------user-guides---------------------------//

router.post('/guide/create', verifyUser, createNewGuide)
router.get(
    '/guide/:guideId/editGuide',
    verifyUser,
    verifyGuideWriter,
    getEditGuideDetails
)

export default router
