import { Schema, model } from 'mongoose'

var tempUserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
    otpData: {
        type: {
            otp: {
                type: String,
            },
            expirationTime: {
                type: Number,
            },
        },
    },
})

//Export the model
export default model('TempUser', tempUserSchema)
