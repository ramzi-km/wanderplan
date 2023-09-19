import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
    messageText: {
        type: String,
        required: true,
    },
    sender: {
        type: Object,
        required: true,
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    time: {
        type: Date,
        default: new Date(),
    },
})

//Export the model
export default model('Message', messageSchema)
