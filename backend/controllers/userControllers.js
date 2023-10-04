import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import guideModel from '../models/guideModel.js'
import tripModel from '../models/tripModel.js'
import userModel from '../models/userModel.js'

//-----------------------------------------------//

export async function getUser(req, res) {
    try {
        const userId = req.user.id
        const user = await userModel
            .findOne({ _id: userId })
            .select('-password')
            .populate({
                path: 'notifications',
                populate: [
                    {
                        path: 'sender',
                        model: 'User',
                        select: 'name profilePic username _id',
                    },
                    {
                        path: 'trip',
                        model: 'Trip',
                        select: 'name _id',
                    },
                ],
            })
            .exec()
        res.status(200).json({ user: user })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function searchUsers(req, res) {
    try {
        const searchTerm = req.query.username
        const regexPattern = new RegExp(searchTerm, 'i')
        const fieldsToReturn = 'name username profilePic email'
        const users = await userModel
            .find({
                $or: [
                    { name: { $regex: regexPattern } },
                    { username: { $regex: regexPattern } },
                ],
            })
            .select(fieldsToReturn)
            .limit(5)

        res.status(200).json({ users: users })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function updateUser(req, res) {
    try {
        let user = req.user
        const detailsToUpdate = {
            username: req.body.username,
            name: req.body.name,
            mobile: req.body.mobile,
        }
        if (
            !detailsToUpdate.username ||
            !detailsToUpdate.name ||
            !detailsToUpdate.mobile
        ) {
            return res
                .status(422)
                .json({ message: 'provide necessary information' })
        }
        const username = detailsToUpdate.username
        const findUser = await userModel.findOne({ username })
        if (findUser && findUser.id !== user.id) {
            return res.status(403).json({ message: 'username already taken' })
        } else {
            user = await userModel
                .findByIdAndUpdate(
                    user.id,
                    { $set: detailsToUpdate },
                    {
                        new: true,
                    }
                )
                .select('-password')
                .populate({
                    path: 'notifications',
                    populate: [
                        {
                            path: 'sender',
                            model: 'User',
                            select: 'name profilePic username _id',
                        },
                        {
                            path: 'trip',
                            model: 'Trip',
                            select: 'name _id',
                        },
                    ],
                })
                .exec()

            res.status(200).json({ user: user, message: 'success' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error, message: 'Internal Server Error' })
    }
}

export async function uploadProfile(req, res) {
    try {
        const user = req.user
        const image = req.body.profilePic
        if (image == undefined) {
            return res.json({ message: 'provide necessary information' })
        }
        const previousProfilePic = user.profilePic
        const profilePic = await cloudinary.uploader.upload(image, {
            folder: 'wanderplan',
        })
        const updatedUser = await userModel
            .findByIdAndUpdate(
                user.id,
                { $set: { profilePic: profilePic.secure_url } },
                {
                    new: true,
                }
            )
            .select('-password')
            .populate({
                path: 'notifications',
                populate: [
                    {
                        path: 'sender',
                        model: 'User',
                        select: 'name profilePic username _id',
                    },
                    {
                        path: 'trip',
                        model: 'Trip',
                        select: 'name _id',
                    },
                ],
            })
            .exec()

        // Default profile picture URL
        const defaultProfilePicUrl =
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1691666473/wanderplan/j7nkqvajk2ppfdfqqpkt.png'

        // Delete the previous profile picture from Cloudinary if it's not the default one
        if (previousProfilePic && previousProfilePic !== defaultProfilePicUrl) {
            const publicId = previousProfilePic.split('/').pop().split('.')[0]
            cloudinary.api
                .delete_resources([`wanderplan/${publicId}`], {
                    type: 'upload',
                    resource_type: 'image',
                })
                .then((data) => console.log(data))
        }

        res.status(200).json({ user: updatedUser, message: 'success' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function resetPassword(req, res) {
    try {
        const user = req.user
        const newPassword = req.body.newPassword
        const currentPassword = req.body.currentPassword
        if (!newPassword) {
            return res.status(404).json({ message: 'provide password' })
        }
        const passwordHash = await bcrypt.hash(newPassword, 10)
        if (user.googleLogin && !user.password) {
            await userModel.findOneAndUpdate(
                { email: user.email },
                { password: passwordHash }
            )
            console.log(user.password)
            return res.status(200).json({ message: 'success' })
        } else {
            const comparison = await bcrypt.compare(
                currentPassword,
                user.password
            )
            if (comparison) {
                await userModel.findOneAndUpdate(
                    { email: user.email },
                    { password: passwordHash }
                )
                return res.status(200).json({ message: 'success' })
            } else {
                return res.status(403).json({ message: 'Incorrect Password' })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getAllUserTrips(req, res) {
    try {
        const user = req.user
        let page = Number(req.query.page ?? 0)
        page = Math.max(page, 0)

        const totalTrips = await tripModel.countDocuments({
            tripMates: user._id,
        })

        const perPage = 6
        const lastPage = Math.max(Math.ceil(totalTrips / perPage) - 1, 0)
        page = Math.min(page, lastPage)
        const trips = await tripModel
            .aggregate([
                {
                    $match: {
                        $or: [{ admin: user._id }, { tripMates: user._id }],
                    },
                },
                {
                    $addFields: {
                        totalPlacesToVisit: {
                            $size: '$overview.placesToVisit',
                        },
                        totalItineraryPlaces: {
                            $sum: '$itinerary.places.length',
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        coverPhoto: 1,
                        startDate: 1,
                        endDate: 1,
                        totalPlacesToVisit: 1,
                        totalItineraryPlaces: 1,
                    },
                },
                {
                    $skip: page * perPage,
                },
                {
                    $limit: perPage,
                },
            ])
            .exec()

        res.status(200).json({ trips: trips, page, lastPage })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
export async function getAllUserGuides(req, res) {
    try {
        const user = req.user

        let page = Number(req.query.page ?? 0)
        page = Math.max(page, 0)

        const totalGuides = await guideModel.countDocuments({
            writer: user._id,
        })

        const perPage = 6
        const lastPage = Math.max(Math.ceil(totalGuides / perPage) - 1, 0)
        page = Math.min(page, lastPage)
        const guides = await guideModel
            .aggregate([
                {
                    $match: {
                        writer: user._id,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        coverPhoto: 1,
                        likes: 1,
                    },
                },
                {
                    $skip: page * perPage,
                },
                {
                    $limit: perPage,
                },
            ])
            .exec()
        res.status(200).json({ guides: guides, page, lastPage })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function acceptTripInvitation(req, res) {
    try {
        const user = req.user
        const tripId = req.params.tripId
        const notificationId = req.params.notificationId
        const trip = await tripModel.findOne({
            _id: tripId,
            invitedTripMates: user.id,
        })
        if (!trip) {
            return res
                .status(400)
                .json({ message: 'Trip not found or user is not invited.' })
        }
        trip.tripMates.push(user.id)
        trip.invitedTripMates.pull(user.id)

        await trip.save()

        if (user) {
            const notification = user.notifications.id(notificationId)

            if (notification) {
                notification.status = 'accepted'
                notification.read = true
                await user.save()
            }
        }

        res.status(200).json({
            message: 'Trip invitation accepted successfully.',
            user: user,
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function markNotifRead(req, res) {
    try {
        const user = req.user
        const notificationId = req.params.notificationId

        if (user) {
            const notification = user.notifications.id(notificationId)

            if (notification) {
                notification.read = true
                await user.save()
                res.status(200).json({
                    message: 'marked notification as read',
                    user: user,
                })
            } else {
                res.status(422).json({ message: 'notification not found' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function markAllUnreadNotifsAsRead(req, res) {
    try {
        const user = req.user

        user.notifications.forEach((notification) => {
            if (!notification.read) {
                notification.read = true
            }
        })

        await user.save()

        res.status(200).json({
            message: 'All unread notifications marked as read',
            user: user,
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getUpcomingTrips(req, res) {
    try {
        const user = req.user
        let today = new Date()
        const year = today.getUTCFullYear()
        const month = today.getUTCMonth() + 1
        const day = today.getUTCDate()
        today = new Date(
            `${year}-${month.toString().padStart(2, '0')}-${day
                .toString()
                .padStart(2, '0')}T00:00:00.000+00:00`
        )
        const next10Days = new Date()
        next10Days.setDate(today.getDate() + 10)

        const tripsWithin10Days = await tripModel
            .aggregate([
                {
                    $match: {
                        tripMates: user._id,
                        startDate: {
                            $lte: next10Days,
                        },
                        endDate: {
                            $gte: today,
                        },
                    },
                },
                {
                    $addFields: {
                        totalPlacesToVisit: {
                            $size: '$overview.placesToVisit',
                        },
                        totalItineraryPlaces: {
                            $sum: '$itinerary.places.length',
                        },
                    },
                },
                {
                    $sort: {
                        startDate: 1,
                        endDate: 1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        coverPhoto: 1,
                        startDate: 1,
                        endDate: 1,
                        totalPlacesToVisit: 1,
                        totalItineraryPlaces: 1,
                    },
                },
            ])
            .exec()
        res.status(200).json({
            message: 'success',
            upcomingTrips: tripsWithin10Days,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function getAllTripsAndGuides(req, res) {
    let page = Number(req.query.page ?? 0)
    page = Math.max(page, 0)
    const filter = req.query.filter ?? 'guides'
    const sort = req.query.sort ?? 'popularity'
    let search = req.query.searchText ?? ''
    search = search.trim()

    let sortOption

    switch (sort) {
        case 'oldest':
            sortOption = { createdAt: 1 }
            break
        case 'newest':
            sortOption = { createdAt: -1 }
            break
        case 'popularity':
            sortOption = { likesCount: -1 }
            break
        default:
            sortOption = { likesCount: -1 }
    }

    if (filter == 'itineraries') {
        const totalItineraries = await tripModel.countDocuments({
            $or: [
                { name: new RegExp(search, 'i') },
                { 'place.name': new RegExp(search, 'i') },
            ],
            unList: false,
        })

        const perPage = 8
        const lastPage = Math.max(Math.ceil(totalItineraries / perPage) - 1, 0)
        page = Math.min(page, lastPage)

        const itineraries = await tripModel
            .find({
                $or: [
                    { name: new RegExp(search, 'i') },
                    { 'place.name': new RegExp(search, 'i') },
                ],
                unList: false,
                visibility: 'public',
            })
            .sort(sortOption)
            .populate('admin', '_id username name profilePic')
            .select({
                _id: 1,
                name: 1,
                coverPhoto: 1,
                place: 1,
                likesCount: 1,
                unList: 1,
                admin: 1,
                'overview.description': 1,
            })
            .skip(page * perPage)
            .limit(perPage)
            .lean()
            .exec()

        res.status(200).json({
            message: 'success',
            itineraries: itineraries,
            page,
            lastPage,
        })
    } else {
        const totalGuides = await guideModel.countDocuments({
            $or: [
                { name: new RegExp(search, 'i') },
                { 'place.name': new RegExp(search, 'i') },
            ],
            unList: false,
        })

        const perPage = 8
        const lastPage = Math.max(Math.ceil(totalGuides / perPage) - 1, 0)
        page = Math.min(page, lastPage)

        const guides = await guideModel
            .find({
                $or: [
                    { name: new RegExp(search, 'i') },
                    { 'place.name': new RegExp(search, 'i') },
                ],
                unList: false,
            })
            .sort(sortOption)
            .populate('writer', '_id username name profilePic')
            .select({
                _id: 1,
                name: 1,
                coverPhoto: 1,
                place: 1,
                writersRelation: 1,
                likesCount: 1,
                unList: 1,
                writer: 1,
            })
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
    }
}
