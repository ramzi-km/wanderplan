// import axios from 'axios'
// import cloudinary from '../config/cloudinary.js'

//------------------ models --------------------//

import tripModel from '../models/tripModel.js'

//-----------------------------------------------//

export async function updateSubheading(req, res) {
    try {
        const trip = req.trip
        const subHeading = req.body.subHeading || ''
        const itineraryIndex = req.params.itineraryIndex
        if (itineraryIndex >= 0 && itineraryIndex < trip.itnerary.length) {
            const updatedTrip = await tripModel.findByIdAndUpdate(
                trip._id,
                {
                    $set: {
                        [`itinerary.${itineraryIndex}.subHeading`]: subHeading,
                    },
                },
                { new: true }
            )
            return res.status(200).json({
                message: 'success',
                subHeading: updatedTrip.itinerary[itineraryIndex].subHeading,
            })
        } else {
            return res.status(400).json({ message: 'Invalid itinerary index' })
        }
    } catch (error) {
        res.status(500).json('internal server error')
    }
}
