import { asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req, res)=>{
    //take user data 
    //check all field are fill
    // check user already exist
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body
    // console.log("email", email)

    if([fullName, username, email, password].some((field)=>field?.trim() === ""))
        {
         throw new ApiError(400, "all field are required")   
        }

    const existeduser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existeduser){
        throw new ApiError(409,"user already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar local file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log("avatar url is", avatar)

    if(!avatar){
        throw new ApiError(400,"avatar is required")
    }


    const user = await User.create({
        fullName,
        email,
        avatar: avatar.url,
        username: username.toLowerCase(),
        coverImage : coverImage?.url || "",
        password
    })


    console.log("user", user)


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    if(!createdUser){
        throw new ApiError(500,"something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

 })

export { registerUser }