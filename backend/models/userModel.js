import { Schema, model } from 'mongoose'

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
        type: Array,
    },
    history: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
        default: [],
    },
    ban: {
        type: Boolean,
        default: false,
    },
})

//Export the model
export default model('User', userSchema)
