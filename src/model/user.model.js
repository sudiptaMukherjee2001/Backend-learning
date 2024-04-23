import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    // name === "" && email === "" && password === "" && address === "" && phone === ""
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,

        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    profile_Image: {
        type: String//cloudinary url
    },
    /*  resume: {
         type: String//cloudinary url
     }, */
    refreshToken: {
        type: String
    }

})


export const user = mongoose.model("user", userSchema)