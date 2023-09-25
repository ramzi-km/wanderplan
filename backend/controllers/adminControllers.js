import categoryModel from '../models/categoryModel.js'
import guideModel from '../models/guideModel.js'
import tripModel from '../models/tripModel.js'
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
        let search = req.query.searchText ?? ''
        search = search.trim()
        let page = Number(req.query.page ?? 0)
        page = Math.max(page, 0)

        const totalGuides = await guideModel.countDocuments({
            $or: [
                { name: new RegExp(search, 'i') },
                { 'place.name': new RegExp(search, 'i') },
            ],
        })

        const perPage = 10
        const lastPage = Math.max(Math.ceil(totalGuides / perPage) - 1, 0)
        page = Math.min(page, lastPage)

        const guides = await guideModel
            .find({
                $or: [
                    { name: new RegExp(search, 'i') },
                    { 'place.name': new RegExp(search, 'i') },
                    { 'writer.username': new RegExp(search, 'i') },
                ],
            })
            .sort({ createdAt: -1 })
            .populate('writer', '_id username name profilePic')
            .skip(page * perPage)
            .limit(perPage)
            .lean()
            .exec()

        res.status(200).json({
            message: 'success',
            guides: guides,
            page,
            lastPage,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function toggleUnlistGuide(req, res) {
    const guideId = req.params.guideId
    try {
        const guide = await guideModel
            .findById(guideId)
            .populate('writer', '_id username name profilePic')
            .exec()

        if (!guide) {
            return res.status(422).json({ message: 'Guide not found' })
        }

        guide.unList = !guide.unList
        await guide.save()

        const message = guide.unList ? 'Guide unlisted' : 'Guide listed'

        res.status(200).json({ message, guide })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getAllItineraries(req, res) {
    try {
        let search = req.query.searchText ?? ''
        search = search.trim()
        let page = Number(req.query.page ?? 0)
        page = Math.max(page, 0)

        const totalItineraries = await tripModel.countDocuments({
            $or: [
                { name: new RegExp(search, 'i') },
                { 'place.name': new RegExp(search, 'i') },
            ],
            visibility: 'public',
        })

        const perPage = 10
        const lastPage = Math.max(Math.ceil(totalItineraries / perPage) - 1, 0)
        page = Math.min(page, lastPage)

        const trips = await tripModel
            .find({
                $or: [
                    { name: new RegExp(search, 'i') },
                    { 'place.name': new RegExp(search, 'i') },
                    { 'admin.username': new RegExp(search, 'i') },
                ],
                visibility: 'public',
            })
            .select('name place coverPhoto admin unList _id')
            .sort({ createdAt: -1 })
            .populate('admin', '_id username name profilePic')
            .skip(page * perPage)
            .limit(perPage)
            .lean()
            .exec()

        res.status(200).json({
            message: 'success',
            itineraries: trips,
            page,
            lastPage,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function toggleUnlistItinerary(req, res) {
    const itineraryId = req.params.itineraryId
    try {
        const itinerary = await tripModel
            .findById(itineraryId)
            .select('name place coverPhoto admin unList _id')
            .populate('admin', '_id username name profilePic')
            .exec()

        if (!itinerary) {
            return res.status(422).json({ message: 'Itinerary not found' })
        }

        itinerary.unList = !itinerary.unList
        await itinerary.save()

        const message = itinerary.unList
            ? 'Itinerary unlisted'
            : 'Itinerary listed'

        res.status(200).json({ message, itinerary })
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
