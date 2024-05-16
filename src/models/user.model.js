import mongoose, { Schema } from "mongoose"
import Jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userScherma = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true
        },
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true
            
        },
        avatar: {
            type: String,  // cloudinary url
            required: true

        },
        coverImage:{
            type: String, //cloudinary url

        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: true,
        },
        refreshToken:{
            type: String
        } 

    },

    {
        timestamps: true
    }
)

userScherma.pre("save", async function(next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userScherma.method.isPasswordCorrrect = async function(password) {
   return await bcrypt.compare(password, this.password)
}


userScherma.method.generateAccesssToken = function(){
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userScherma.method.generateRefreshToken = function(){
    Jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)