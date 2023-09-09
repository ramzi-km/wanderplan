import axios from 'axios'
// import cloudinary from '../config/cloudinary.js'

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
