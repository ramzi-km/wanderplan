import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var adminSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//Export the model
export default model('Admin', adminSchema);