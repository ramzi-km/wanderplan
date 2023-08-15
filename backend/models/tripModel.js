import { Schema, model } from 'mongoose'

const placeToVisitSchema = new Schema({
    coordinates: [Number],
    name: String,
    extendedName: String,
    image: String,
    description: String,
    note: String,
})

const itineraryPlaceSchema = new Schema({
    name: String,
    image: String,
    description: String,
    note: String,
    coordinates: [Number],
    extendedName: String,
    startTime: Date,
    endTime: Date,
    expense: { type: Schema.Types.ObjectId, ref: 'Expense' },
})

const tripSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    startDate: Date,
    endDate: Date,
    coverPhoto: String,
    place: {
        name: String,
        extendedName: String,
        coordinates: [Number],
    },
    tripMates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    visibility: {
        type: String,
        default: 'private',
    },
    overview: {
        description: String,
        notes: String,
        placesToVisit: [placeToVisitSchema],
    },
    itinerary: [
        {
            Date: Date,
            subHeading: String,
            places: [itineraryPlaceSchema],
        },
    ],
    budget: {
        limit: Number,
        expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    },
})

export default model('Trip', tripSchema)
