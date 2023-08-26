import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import tripModel from '../models/tripModel.js'
import userModel from '../models/userModel.js'

//-----------------------------------------------//

export async function getUser(req, res) {
    try {
        res.status(200).json({ user: req.user })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
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
        console.log(user)
        if (user.googleLogin && !user.password) {
            await userModel.findOneAndUpdate(
                { email: user.email },
                { password: passwordHash }
            )
            console.log(user.password);
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
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function getAllTrips(req, res) {
    try {
        const user = req.user
        const trips = await tripModel
            .aggregate([
                {
                    $match: {
                        $or: [{ userId: user._id }, { tripMates: user._id }],
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
                        userId: 1,
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
        res.status(200).json({ trips: trips })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function getRecentAndUpcomingTrips(req, res) {
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
                        $or: [{ userId: user._id }, { tripMates: user._id }],
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

        const recent = await userModel
            .aggregate([
                { $match: { _id: user._id } },
                {
                    $project: {
                        history: 1,
                    },
                },
            ])
            .exec()

        const recentArr = [...recent[0].history]

        const recentTrips = await tripModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: recentArr.map(
                            (id) => new mongoose.Types.ObjectId(id)
                        ),
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

        res.status(200).json({
            message: 'success',
            recentTrips: recentTrips,
            upcomingTrips: tripsWithin10Days,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
