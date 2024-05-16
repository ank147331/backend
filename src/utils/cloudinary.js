import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

          
cloudinary.config({ 
  cloud_name: 'dczrh6lko', 
  api_key: '498259442737897', 
  api_secret: 'CBhIu0y1O3ulACBIvjDiHukNbQ4' 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null

    const respoce = cloudinary.uploader.upload(localFilePath,
      {
        resource_type: "auto"
      }
    )
    fs.unlinkSync(localFilePath)

    return respoce;

  } catch (error) {

    fs.unlinkSync(localFilePath)

    return null;

  }
}

