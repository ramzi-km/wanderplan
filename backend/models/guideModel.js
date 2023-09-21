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
        coverPhoto: String,
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
                        image: String,
                        description: String,
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
    },
    { timestamps: true }
)

export default model('Guide', guideSchema)
