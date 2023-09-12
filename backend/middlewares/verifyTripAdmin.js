import tripModel from '../models/tripModel.js'

export default async function verifyTripAdmin(req, res, next) {
    try {
        const user = req.user
        const tripId = req.params.id
        const trip = await tripModel.findById(tripId)
        if (!trip.admin.equals(user._id)) {
            return res.status(422).json({ message: 'Access denied' })
        }
        req.user = user
        req.trip = trip
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error.' })
    }
}
