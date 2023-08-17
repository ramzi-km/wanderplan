//------------------ models --------------------//

import tripModel from '../models/tripModel.js'

//-----------------------------------------------//

export async function addNewTrip(req, res) {
    try {
        const frontendData = req.body

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
            userId: req.user.id,
            name: `Trip to ${frontendData.place.name}`,
            startDate: startDate,
            endDate: endDate,
            place: {
                name: frontendData.place.name,
                extendedName: frontendData.place.extendedName,
                coordinates: frontendData.place.coordinates,
            },
            tripMates: [],
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

        if (frontendData.place?.description?.length > 3) {
            newTripData.overview.description = frontendData.place.description
        }
        if (frontendData.place?.photoUrl?.length > 3) {
            newTripData.coverPhoto = frontendData.place.photoUrl
        }

        // Create the new trip
        const newTrip = new tripModel(newTripData)
        const savedTrip = await newTrip.save()
        console.log(savedTrip)

        res.status(201).json({
            message: 'New trip added',
            trip: savedTrip,
        })
    } catch (error) {
        console.error('Error adding new trip:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getTripDetails(req, res) {
    try {
        const user = req.user
        const tripId = req.params.id
        const owner = await tripModel.findById(tripId).select('userId')
        if (owner.userId.equals(user._id)) {
            const trip = await tripModel.findById(tripId)

            return res
                .status(200)
                .json({ message: 'Success', trip: trip, editable: true })
        } else {
            const trip = await tripModel.findById(tripId).select('userId')
            return res
                .status(200)
                .json({ message: 'success', trip: trip, editable: false })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
