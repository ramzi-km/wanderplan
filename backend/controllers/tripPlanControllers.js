//------------------ models --------------------//

import tripModel from '../models/tripModel.js'

//-----------------------------------------------//

export async function addNewTrip(req, res) {
    try {
        const frontendData = req.body
        console.log(frontendData.endDate, frontendData.startDate)
        // Calculate the number of days
        const startDate = new Date(frontendData.startDate)
        const endDate = new Date(frontendData.endDate)

        const timeDifference = endDate.getTime() - startDate.getTime()
        const daysBetween =
            Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1

        // Construct the itinerary array
        const itinerary = []
        for (let day = 0; day < daysBetween; day++) {
            const currentDate = new Date(frontendData.startDate)
            currentDate.setDate(currentDate.getDate() + day)

            const itineraryItem = {
                Date: currentDate,
                subHeading: '',
                places: [],
            }

            itinerary.push(itineraryItem)
        }
        console.log(itinerary)
        // Construct the new trip data
        const newTripData = {
            userId: req.user.id,
            name: `Trip to ${frontendData.place.name}`,
            starDate: frontendData.startDate,
            endDate: frontendData.endDate,
            coverPhoto: frontendData.place.photoUrl,
            place: {
                name: frontendData.place.name,
                extendedName: frontendData.place.extendedName,
                coordinates: frontendData.place.coordinates,
            },
            tripMates: [],
            visibility: frontendData.visibility,
            overview: {
                description: frontendData.place.description,
                notes: '',
                placesToVisit: [],
            },
            itinerary: itinerary,
            budget: {
                expenses: [],
            },
        }
        console.log(newTripData)

        // Create the new trip
        const newTrip = new tripModel(newTripData)
        const savedTrip = await newTrip.save()

        res.status(201).json({
            message: 'New trip added',
            tripId: savedTrip.id,
        })
    } catch (error) {
        console.error('Error adding new trip:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
