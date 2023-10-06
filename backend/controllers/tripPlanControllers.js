import axios from 'axios'
import jwt from 'jsonwebtoken'
import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import tripModel from '../models/tripModel.js'
import userModel from '../models/userModel.js'

//-----------------------------------------------//

export async function createNewTrip(req, res) {
    try {
        const frontendData = req.body
        const accessKey = process.env.UNSPLASH_KEY
        const trimmedQuery = frontendData?.place?.name?.trim()

        const updateDescriptionPageResponse = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
                trimmedQuery
            )}`
        )

        const pageId =
            updateDescriptionPageResponse?.data?.query?.search[0]?.pageid
        const updateDescriptionResponse = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&list=&pageids=${pageId}&formatversion=2&exsentences=3&exintro=1&explaintext=1`
        )

        const fetchPhotoUrlResponse = await axios.get(
            `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${trimmedQuery}`
        )
        const description =
            updateDescriptionResponse?.data?.query?.pages[0]?.extract
        const photoUrl = fetchPhotoUrlResponse?.data?.results[0]?.urls?.regular

        // Calculate the number of days
        const startDate = new Date(frontendData.startDate)
        // Adding 5 hours and 30 minutes
        startDate.setHours(startDate.getHours() + 5)
        startDate.setMinutes(startDate.getMinutes() + 30)
        const endDate = new Date(frontendData.endDate)
        // Adding 5 hours and 30 minutes
        endDate.setHours(endDate.getHours() + 5)
        endDate.setMinutes(endDate.getMinutes() + 30)

        const timeDifference = endDate.getTime() - startDate.getTime()
        const daysBetween =
            Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1

        // Construct the itinerary array
        const itinerary = []
        for (let day = 0; day < daysBetween; day++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(currentDate.getDate() + day)

            const itineraryItem = {
                Date: currentDate,
                subHeading: '',
                places: [],
            }

            itinerary.push(itineraryItem)
        }

        // Construct the new trip data
        const newTripData = {
            admin: req.user.id,
            name: `Trip to ${frontendData.place.name}`,
            startDate: startDate,
            endDate: endDate,
            place: {
                name: frontendData.place.name,
                extendedName: frontendData.place.extendedName,
                coordinates: frontendData.place.coordinates,
            },
            tripMates: [req.user.id],
            visibility: frontendData.visibility,
            overview: {
                notes: '',
                placesToVisit: [],
            },
            itinerary: itinerary,
            budget: {
                expenses: [],
            },
        }

        if (description?.length > 3) {
            newTripData.overview.description = description
        }
        if (photoUrl?.length > 3) {
            newTripData.coverPhoto = photoUrl
        }

        // Create the new trip
        const newTrip = new tripModel(newTripData)
        const savedTrip = await newTrip.save()
        const trip = await tripModel
            .findById(savedTrip._id)
            .populate({
                path: 'admin',
                select: '_id username name profilePic',
                as: 'admin',
            })
            .populate('tripMates', '_id username name profilePic')
            .exec()

        res.status(201).json({
            message: 'New trip added',
            trip: trip,
        })
    } catch (error) {
        console.error('Error adding new trip:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getTripDetails(req, res) {
    try {
        const tripId = req.params.id
        const trip = await tripModel
            .findById(tripId)
            .populate('admin', '_id username name profilePic')
            .populate('tripMates', '_id username name profilePic')
            .populate('budget.expenses')
            .exec()
        return res.status(200).json({ message: 'Success', trip: trip })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getViewTripDetails(req, res) {
    try {
        const tripId = req.params.id
        const token = req.cookies.userToken
        let user = undefined
        if (token) {
            const secret = process.env.JWT_SECRET_KEY
            const decoded = jwt.verify(token, secret)
            user = await userModel.findOne({ _id: decoded._id })
        }

        const trip = await tripModel
            .findOne({
                _id: tripId,
                $or: [
                    { unList: false, visibility: 'public' },
                    { tripMates: user?._id },
                ],
            })
            .populate('admin', '_id username name profilePic')
            .select('-budget -invitedTripMates -visibility')
            .exec()

        if (!trip) {
            return res.status(400).json({ message: 'Invalid trip id' })
        }
        return res
            .status(200)
            .json({ message: 'Success', trip: trip, tripmates: trip.tripMates })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function likeTrip(req, res) {
    try {
        const tripId = req.params.id
        const userId = req.user._id

        const [likedUser, trip] = await Promise.all([
            userModel.findById(userId),
            tripModel.findById(tripId).populate('admin'),
        ])

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' })
        }

        if (trip.likes.includes(userId)) {
            return res
                .status(400)
                .json({ message: 'You have already liked this trip' })
        }

        trip.likes.push(likedUser._id)
        trip.likesCount++

        const savedTrip = await trip.save()
        const tripAdmin = savedTrip.admin

        if (likedUser._id.toString() == tripAdmin._id.toString()) {
            return res.status(200).json({
                message: 'Trip liked successfully',
                likesCount: trip.likesCount,
                likes: trip.likes,
            })
        }

        const notification = {
            type: 'tripLike',
            content: `${likedUser.username} liked your trip "${trip.name}".`,
            sender: likedUser._id,
            timestamp: new Date(),
        }
        tripAdmin.notifications.unshift(notification)
        tripAdmin.save()

        const admin = await userModel.findOne({ _id: tripAdmin._id }).populate({
            path: 'notifications',
            populate: [
                {
                    path: 'sender',
                    model: 'User',
                    select: 'name profilePic username _id',
                },
            ],
        })

        const savedNotification = admin.notifications.shift()

        res.status(200).json({
            message: 'Trip liked successfully',
            likesCount: trip.likesCount,
            likes: trip.likes,
            notification: savedNotification,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function unlikeTrip(req, res) {
    try {
        const tripId = req.params.id
        const userId = req.user._id

        const trip = await tripModel.findById(tripId)

        if (!trip) {
            return res.status(404).json({ message: 'Guide not found' })
        }

        if (!trip.likes.includes(userId)) {
            return res
                .status(400)
                .json({ message: 'You have not liked this Trip' })
        }

        trip.likes = trip.likes.filter(
            (likedUserId) => likedUserId.toString() !== userId.toString()
        )

        trip.likesCount--

        await trip.save()

        res.status(200).json({
            message: 'Trip unliked successfully',
            likesCount: trip.likesCount,
            likes: trip.likes,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function inviteTripMate(req, res) {
    try {
        const admin = req.user
        const trip = req.trip
        const tripMateId = req.body.userId
        const tripMate = await userModel.findById(tripMateId)

        if (!tripMate) {
            return res.status(404).json({ message: 'Trip mate not found' })
        }
        if (trip.invitedTripMates.includes(tripMateId)) {
            return res
                .status(400)
                .json({ message: 'Trip mate is already invited' })
        }
        trip.invitedTripMates.unshift(tripMateId)
        const notification = {
            type: 'tripInvite',
            content: `You have been invited to join the trip "${trip.name}" by ${admin.username}.`,
            sender: admin._id,
            trip: trip._id,
            timestamp: new Date(),
        }
        tripMate.notifications.unshift(notification)
        await Promise.all([trip.save(), tripMate.save()])
        const tripmate = await userModel
            .findOne({ _id: tripMate._id })
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

        const savedNotification = tripmate.notifications.shift()

        return res.status(200).json({
            message: 'Trip mate invited successfully',
            invitedTripMates: trip.invitedTripMates,
            notification: savedNotification,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function removeTripMate(req, res) {
    const tripId = req.params.id
    const tripMateId = req.params.tripMateId
    try {
        const trip = await tripModel.findById(tripId)

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' })
        }

        if (trip.admin.toString() === tripMateId) {
            return res
                .status(403)
                .json({ message: 'Cannot remove the trip admin' })
        }

        const updatedTripMates = trip.tripMates.filter(
            (mate) => mate.toString() !== tripMateId
        )

        trip.tripMates = updatedTripMates
        await trip.save()
        await trip.populate('tripMates', '_id username name profilePic')

        return res.status(200).json({
            message: 'Trip mate removed successfully',
            tripMates: trip.tripMates,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function leaveTrip(req, res) {
    const tripId = req.params.id
    const userId = req.user.id
    try {
        const trip = await tripModel.findById(tripId)

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' })
        }
        if (trip.admin.toString() === userId) {
            return res
                .status(403)
                .json({ message: 'Trip admin cannot leave trip' })
        }

        trip.tripMates = trip.tripMates.filter(
            (mate) => mate.toString() !== userId
        )

        await trip.save()

        return res.status(200).json({
            message: 'left trip successfully',
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export async function changeTripName(req, res) {
    try {
        const tripId = req.params.id
        const name = req.body.tripName
        if (!name) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            { name: name },
            { new: true }
        )
        return res.status(200).json({ message: 'success', tripName: trip.name })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function changeTripVisibility(req, res) {
    try {
        const tripId = req.params.id
        const visibility = req.body.visibility
        if (!visibility) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            { visibility: visibility },
            { new: true }
        )
        return res
            .status(200)
            .json({ message: 'success', visibility: trip.visibility })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function changeCoverPhoto(req, res) {
    try {
        const trip = req.trip
        const image = req.body.coverPhoto
        if (!image) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const previousCoverPhoto = trip.coverPhoto
        const coverPhoto = await cloudinary.uploader.upload(image, {
            folder: 'wanderplan',
        })
        const updatedTrip = await tripModel.findByIdAndUpdate(
            trip.id,
            { $set: { coverPhoto: coverPhoto.secure_url } },
            {
                new: true,
            }
        )

        const defaultCoverPhotoUrl =
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg'

        if (previousCoverPhoto && previousCoverPhoto !== defaultCoverPhotoUrl) {
            const publicId = previousCoverPhoto.split('/').pop().split('.')[0]
            cloudinary.api
                .delete_resources([`wanderplan/${publicId}`], {
                    type: 'upload',
                    resource_type: 'image',
                })
                .then((data) => console.log(data))
        }
        return res
            .status(200)
            .json({ message: 'Success', coverPhoto: updatedTrip.coverPhoto })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function updateDescription(req, res) {
    try {
        const tripId = req.trip._id
        const description = req.body.description || ''
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            { $set: { 'overview.description': description } },
            { new: true }
        )
        return res.status(200).json({
            message: 'success',
            tripDescription: trip.overview.description,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function updateNotes(req, res) {
    try {
        const tripId = req.trip._id
        const notes = req.body.notes || ''
        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            { $set: { 'overview.notes': notes } },
            { new: true }
        )
        return res.status(200).json({
            message: 'success',
            overviewNotes: trip.overview.notes,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function addPlaceToVisit(req, res) {
    try {
        const tripId = req.trip._id
        let place = req.body.place
        if (!place?.name || !place.coordinates) {
            res.status(422).json({ message: 'provide necessary information' })
        }
        const accessKey = process.env.UNSPLASH_KEY
        const trimmedQuery = place?.name?.trim()
        const descriptionPageResponse = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
                trimmedQuery
            )}`
        )

        const pageId = descriptionPageResponse?.data?.query?.search[0]?.pageid
        const descriptionResponse = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&list=&pageids=${pageId}&formatversion=2&exsentences=2&exintro=1&explaintext=1`
        )

        const fetchPhotoUrlResponse = await axios.get(
            `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${trimmedQuery}`
        )

        const description = descriptionResponse.data?.query?.pages[0]?.extract
        const photoUrl = fetchPhotoUrlResponse.data?.results[0]?.urls?.regular
        if (description) {
            place.description = description
        }
        if (photoUrl) {
            place.image = photoUrl
        }

        const trip = await tripModel.findByIdAndUpdate(
            tripId,
            { $push: { 'overview.placesToVisit': place } },
            { new: true }
        )
        return res.status(200).json({
            message: 'success',
            place: trip.overview.placesToVisit.pop(),
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export async function deletePlaceToVisit(req, res) {
    try {
        const trip = req.trip
        const placeIndex = req.params.placeIndex
        if (
            placeIndex >= 0 &&
            placeIndex < trip.overview.placesToVisit.length
        ) {
            trip.overview.placesToVisit.splice(placeIndex, 1)
            await trip.save()
            return res
                .status(200)
                .json({ message: 'Place deleted successfully' })
        } else {
            return res.status(400).json({ message: 'Invalid place index' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function changePlaceToVisitPhoto(req, res) {
    try {
        const trip = req.trip
        const placeIndex = req.params.placeIndex
        let image = req.body.image
        if (!image) {
            res.status(422).json({ message: 'provide image' })
        }
        if (
            placeIndex >= 0 &&
            placeIndex < trip.overview.placesToVisit.length
        ) {
            const previousImage = trip.overview.placesToVisit[placeIndex].image
            image = await cloudinary.uploader.upload(image, {
                folder: 'wanderplan',
            })
            trip.overview.placesToVisit[placeIndex].image = image.secure_url
            await trip.save()
            const defaultImageUrl =
                'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg'

            if (previousImage && previousImage !== defaultImageUrl) {
                const publicId = previousImage.split('/').pop().split('.')[0]
                cloudinary.api
                    .delete_resources([`wanderplan/${publicId}`], {
                        type: 'upload',
                        resource_type: 'image',
                    })
                    .then((data) => console.log(data))
            }
            const updatedPlace = trip.overview.placesToVisit[placeIndex]
            return res
                .status(200)
                .json({ message: 'success', place: updatedPlace })
        } else {
            return res.status(400).json({ message: 'Invalid place index' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function updatePlaceToVisitDescription(req, res) {
    try {
        const trip = req.trip
        const placeIndex = req.params.placeIndex
        let description = req.body.description || ''

        if (
            placeIndex >= 0 &&
            placeIndex < trip.overview.placesToVisit.length
        ) {
            trip.overview.placesToVisit[placeIndex].description = description
            await trip.save()

            const updatedPlace = trip.overview.placesToVisit[placeIndex]
            return res
                .status(200)
                .json({ message: 'success', place: updatedPlace })
        } else {
            return res.status(400).json({ message: 'Invalid place index' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function deleteTrip(req, res) {
    try {
        const tripId = req.trip.id
        await tripModel.findByIdAndRemove(tripId)
        res.status(200).json({ message: 'Trip deleted successfully' })
    } catch (error) {
        console.error('Error deleting trip:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
