import categoryModel from '../models/categoryModel.js'
import userModel from '../models/userModel.js'

export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({}, { password: 0, __v: 0 }).lean()
        res.status(200).json({ users: users, message: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function blockUser(req, res) {
    try {
        const userId = req.params.id
        const user = await userModel.findById(userId)
        if (userId) {
            user.ban = !user.ban
            await user.save()
            res.status(200).json({ message: 'Success', userId: user.id })
        } else {
            res.status(422).json({
                message: 'user with the provided id does not exist',
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function addCategory(req, res) {
    try {
        const categoryName = req.body.categoryName.toLowerCase()
        const categoryIcon = req.body.categoryIcon
        const existingCategory = await categoryModel.findOne({
            name: categoryName,
        })
        if (existingCategory) {
            return res.status(403).json({ message: 'category already exist' })
        }
        const newCategory = await categoryModel.create({
            name: categoryName,
            icon: categoryIcon,
        })
        res.status(200).json({ message: 'success', category: newCategory })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
export async function getAllCategories(req, res) {
    try {
        const categories = await categoryModel.find().lean()
        res.status(200).json({ message: 'success', categories: categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
