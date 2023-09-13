import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        unList: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

export default model('Category', categorySchema)
