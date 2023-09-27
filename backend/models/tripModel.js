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
    time: {
        startTime: String,
        endTime: String,
    },
    attachment: String,
    expense: { type: Schema.Types.ObjectId, ref: 'Expense' },
})

const tripSchema = new Schema(
    {
        admin: { type: Schema.Types.ObjectId, ref: 'User' },
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
        invitedTripMates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
            limit: { type: Number },
            expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likesCount: { type: Number, default: 0 },
        unList: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

export default model('Trip', tripSchema)
