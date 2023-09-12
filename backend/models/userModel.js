import { Schema, model } from 'mongoose'

const notificationSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip' },
    status: {
        type: String,
        default: 'pending',
    },
    read: {
        type: Boolean,
        default: false,
    },
})

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
    },
    password: {
        type: String,
    },
    profilePic: {
        type: String,
        default:
            'https://res.cloudinary.com/dbmujhmpe/image/upload/v1691666473/wanderplan/j7nkqvajk2ppfdfqqpkt.png',
    },
    googleLogin: {
        type: Boolean,
        default: false,
    },
    notifications: {
        type: [notificationSchema],
    },
    ban: {
        type: Boolean,
        default: false,
    },
})

//Export the model
export default model('User', userSchema)
