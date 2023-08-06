import express from 'express'
import {
    getAdminData,
    postAdminLogin,
    postAdminLogout,
} from '../controllers/adminAuthControllers.js'
import { blockUser, getAllUsers } from '../controllers/adminControllers.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
const router = express.Router()

router.post('/login', postAdminLogin)
router.post('/logout', postAdminLogout)
router.get('/data', verifyAdmin, getAdminData)
router.get('/allUsers', verifyAdmin, getAllUsers)
router.patch('/blockUser/:id', verifyAdmin, blockUser)

export default router
