import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: 'resume-form-upload',
  api_key: '463665732763852',
  api_secret: 'FcfyFmrNZsye1ALIi9uulmdVfes'
});

const uploadFileInCLoudinary = async (LocalFilePath) => {
  console.log("local file path", LocalFilePath);
  try {
    if (!LocalFilePath) return null;
    const response = await cloudinary.uploader.upload(LocalFilePath, { resource_type: "auto" });
    fs.unlinkSync(LocalFilePath); // delete local copy after uploaded to CLOUDINARY
    return response;
  } catch (error) {
    fs.unlinkSync(LocalFilePath);
    throw new Error(`Error with uploading the image to Cloudinary ${error}`);
  }
}

export default uploadFileInCLoudinary;