import { Schema, model } from 'mongoose';

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:Object,
    },
    notifications:{
        type:Array
    },
    ban:{
        type:Boolean,
        default:false,
    }
});

//Export the model
export default model('User', userSchema);