import { Schema, model } from 'mongoose'

const placeToVisitSchema = new Schema({
    coordinates: [Number],
    name: String,
    extendedName: String,
    image: {
        type: String,
        default:
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg',
    },
    description: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: '',
    },
})

const itineraryPlaceSchema = new Schema({
    name: String,
    image: {
        type: String,
        default:
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg',
    },
    description: {
        type: String,
        default: '',
    },
    note: {
        type: String,
        default: '',
    },
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
    coverPhoto: {
        type: String,
        default:
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg',
    },
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
        description: {
            type: String,
            default: '',
        },
        notes: String,
        placesToVisit: [placeToVisitSchema],
    },
    itinerary: [
        {
            Date: Date,
            subheading: {
                type: String,
                default: '',
            },
            places: [itineraryPlaceSchema],
        },
    ],
    budget: {
        limit: { type: Number, default: 0 },
        expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    },
})

export default model('Trip', tripSchema)
