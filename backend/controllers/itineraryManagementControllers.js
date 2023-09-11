import axios from 'axios'
import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import tripModel from '../models/tripModel.js'

//-----------------------------------------------//

export async function updateSubheading(req, res) {
    try {
        const trip = req.trip
        const subheading = req.body.subheading || ''
        const itineraryIndex = req.params.itineraryIndex
        if (itineraryIndex >= 0 && itineraryIndex < trip.itinerary?.length) {
            const updatedTrip = await tripModel.findByIdAndUpdate(
                trip._id,
                {
                    $set: {
                        [`itinerary.${itineraryIndex}.subheading`]: subheading,
                    },
                },
                { new: true }
            )
            return res.status(200).json({
                message: 'success',
                subheading: updatedTrip.itinerary[itineraryIndex].subheading,
            })
        } else {
            return res.status(400).json({ message: 'invalid itinerary index' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function addPlace(req, res) {
    try {
        const trip = req.trip
        const place = req.body.place
        const itineraryId = req.params.itineraryId
        if (!place?.name || !place.coordinates) {
            res.status(422).json({ message: 'provide necessary information' })
        }

        const itinerary = trip.itinerary.find(
            (item) => item._id.toString() === itineraryId
        )
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' })
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
        itinerary.places.push(place)
        await trip.save()
        res.status(200).json({
            message: 'Place added to itinerary successfully',
            place: itinerary.places.pop(),
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function updatePlaceDescription(req, res) {
    try {
        const trip = req.trip
        const description = req.body.description
        const dayIndex = req.params.dayIndex
        const placeIndex = req.params.placeIndex
        if (
            dayIndex < 0 ||
            dayIndex >= trip.itinerary.length ||
            placeIndex < 0 ||
            placeIndex >= trip.itinerary[dayIndex].places.length
        ) {
            return res
                .status(400)
                .json({ message: 'invalid dayIndex or placeIndex' })
        }

        trip.itinerary[dayIndex].places[placeIndex].description = description
        await trip.save()
        const updatedPlace = trip.itinerary[dayIndex].places[placeIndex]
        res.status(200).json({
            message: 'place description updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function updatePlaceNotes(req, res) {
    try {
        const trip = req.trip
        const notes = req.body.notes
        const dayIndex = req.params.dayIndex
        const placeIndex = req.params.placeIndex
        if (
            dayIndex < 0 ||
            dayIndex >= trip.itinerary.length ||
            placeIndex < 0 ||
            placeIndex >= trip.itinerary[dayIndex].places.length
        ) {
            return res
                .status(400)
                .json({ message: 'invalid dayIndex or placeIndex' })
        }

        trip.itinerary[dayIndex].places[placeIndex].note = notes
        await trip.save()
        const updatedPlace = trip.itinerary[dayIndex].places[placeIndex]
        res.status(200).json({
            message: 'place note updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

export async function updatePlaceImage(req, res) {
    try {
        const trip = req.trip
        let image = req.body.image
        const dayIndex = req.params.dayIndex
        const placeIndex = req.params.placeIndex
        if (!image) {
            res.status(422).json({ message: 'provide image' })
        }
        if (
            dayIndex < 0 ||
            dayIndex >= trip.itinerary.length ||
            placeIndex < 0 ||
            placeIndex >= trip.itinerary[dayIndex].places.length
        ) {
            return res
                .status(400)
                .json({ message: 'invalid dayIndex or placeIndex' })
        }
        const previousImage = trip.itinerary[dayIndex].places[placeIndex].image
        image = await cloudinary.uploader.upload(image, {
            folder: 'wanderplan',
        })
        trip.itinerary[dayIndex].places[placeIndex].image = image.secure_url
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
        const updatedPlace = trip.itinerary[dayIndex].places[placeIndex]
        res.status(200).json({
            message: 'place image updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function updatePlaceTime(req, res) {
    try {
        const trip = req.trip
        const time = req.body.time
        const dayIndex = req.params.dayIndex
        const placeIndex = req.params.placeIndex
        if (
            dayIndex < 0 ||
            dayIndex >= trip.itinerary.length ||
            placeIndex < 0 ||
            placeIndex >= trip.itinerary[dayIndex].places.length
        ) {
            return res
                .status(400)
                .json({ message: 'invalid dayIndex or placeIndex' })
        }

        trip.itinerary[dayIndex].places[placeIndex].time = time
        await trip.save()
        const updatedPlace = trip.itinerary[dayIndex].places[placeIndex]
        res.status(200).json({
            message: 'place time updated successfully',
            place: updatedPlace,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
export async function deleteItineraryPlace(req, res) {
    try {
        const trip = req.trip
        const dayIndex = req.params.dayIndex
        const placeIndex = req.params.placeIndex
        if (
            dayIndex < 0 ||
            dayIndex >= trip.itinerary.length ||
            placeIndex < 0 ||
            placeIndex >= trip.itinerary[dayIndex].places.length
        ) {
            return res
                .status(400)
                .json({ message: 'invalid dayIndex or placeIndex' })
        }

        trip.itinerary[dayIndex].places.splice(placeIndex, 1)
        await trip.save()
        return res.status(200).json({ message: 'Place deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server error' })
    }
}
