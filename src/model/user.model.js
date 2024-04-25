import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

userSchema.methods.isPasswordMatch = async function (clientPassword) {
    return await bcrypt.compare(clientPassword, this.password)
}

userSchema.methods.genarateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1s' }, //token will expire in 1 hour
    )

}
userSchema.methods.genarateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFERSH_TOKEN_SECRET,
        { expiresIn: '1s' }, //token will expire in 1 hour
    )

}

export const user = mongoose.model("user", userSchema)