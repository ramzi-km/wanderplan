import categoryModel from '../models/categoryModel.js'
import guideModel from '../models/guideModel.js'
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

export async function getAllCategories(req, res) {
    try {
        const categories = await categoryModel.find().lean()
        res.status(200).json({ message: 'success', categories: categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getAllGuides(req, res) {
    try {
        const guides = await guideModel
            .find()
            .populate('writer', '_id username name profilePic')
            .lean()
            .exec()

        res.status(200).json({ message: 'success', guides: guides })
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

export async function editCategory(req, res) {
    try {
        const categoryId = req.params.categoryId
        const updatedCategoryName = req.body.categoryName.toLowerCase()
        const updatedCategoryIcon = req.body.categoryIcon

        const existingCategory = await categoryModel.findById(categoryId)

        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }

        if (updatedCategoryName !== existingCategory.name) {
            const categoryWithSameName = await categoryModel.findOne({
                name: updatedCategoryName,
            })
            if (categoryWithSameName) {
                return res
                    .status(403)
                    .json({ message: 'Category name already exists' })
            }
        }

        existingCategory.name = updatedCategoryName
        existingCategory.icon = updatedCategoryIcon

        const updatedCategory = await existingCategory.save()

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function toggleUnlistCategory(req, res) {
    const categoryId = req.params.categoryId
    try {
        const category = await categoryModel.findById(categoryId)

        if (!category) {
            return res.status(422).json({ message: 'Category not found' })
        }

        category.unList = !category.unList
        await category.save() // Save the updated category

        const message = category.unList
            ? 'Category unlisted'
            : 'Category listed'

        res.status(200).json({ message, category })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
