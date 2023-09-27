import { Schema, model } from 'mongoose'

const guideSchema = new Schema(
    {
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
        },
        coverPhoto: {
            type: String,
            default:
                'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg',
        },
        place: {
            name: {
                type: String,
                required: true,
            },
            extendedName: String,
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        writersRelation: String,
        generalTips: String,
        sections: [
            {
                name: {
                    type: String,
                },
                note: String,
                places: [
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        image: {
                            type: String,
                            default:
                                'https://res.cloudinary.com/dbmujhmpe/image/upload/v1692011176/wanderplan/default-image_th3auj.jpg',
                        },
                        description: {
                            type: String,
                            default: '',
                        },
                        coordinates: {
                            type: [Number],
                            required: true,
                        },
                    },
                ],
            },
        ],
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

export default model('Guide', guideSchema)
