import express from 'express'
import {
    getAdminData,
    postAdminLogin,
    postAdminLogout,
} from '../controllers/adminAuthControllers.js'
import {
    addCategory,
    blockUser,
    editCategory,
    getAllCategories,
    getAllUsers,
    toggleUnlistCategory,
} from '../controllers/adminControllers.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
const router = express.Router()

router.post('/login', postAdminLogin)
router.post('/logout', postAdminLogout)
router.get('/data', verifyAdmin, getAdminData)

//----------------------user management---------------------//
router.get('/allUsers', verifyAdmin, getAllUsers)
router.patch('/blockUser/:id', verifyAdmin, blockUser)

//-------------------category management--------------------//
router.get('/categories', verifyAdmin, getAllCategories)
router.post('/category', verifyAdmin, addCategory)
router.patch('/category/:categoryId', verifyAdmin, editCategory)
router.patch(
    '/category/:categoryId/toggleUnlist',
    verifyAdmin,
    toggleUnlistCategory
)

export default router
