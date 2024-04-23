/* Import user from model so that we can perform all the operation in mongodb */
import databaseName from "../constant.js";
import { user } from "../model/user.model.js";
// import cloudinary from utils file
import uploadFileInCLoudinary from '../utils/cloudinary_imp.js'
import bcrypt from "bcryptjs"

const registerController = async (req, res, next) => {

    const { name, email, password, address, phone } = req.body;
    // for handeling file we have to use  multer middleware in router

    /* This will checking the validation */
    let checkedEmail, passwordVerifed, hashPassword, profile_image_localPath, cloudinary_profile_image;
    if (name === "" && email === "" && password === "" && address === "" && phone === "") {
        res.status("400").json({ error: "All fields must be filled" });
        throw new Error("All Fields Are Required");
    }

    // This  is a simple way of validating an Email Address.
    if (email.includes("@")) {
        checkedEmail = email;
    }
    else {
        res.status("401").json({ error: "Check your email field" });
        return;
    }

    console.log("this is checkedEmail ", checkedEmail);



    /* This password validation with hashing*/
    if (password.length > 0 && password.length <= 6) {
        console.log("THis is password", password);
        hashPassword = await bcrypt.hash(password, 8)
        passwordVerifed = hashPassword;

    }
    else {
        res.status('422').send({ error: "Password should contain at least six characters." });
        return;

    }
    console.log("hashPassword", hashPassword);

    /* Check the user is already register  or not  using email and name*/
    const excitedUser = await user.findOne({
        $or: [{ name }, { email }]
    })
    console.log("excited user", excitedUser);
    if (excitedUser) {
        res.status('409').json({ error: "This user is already registered." });
        return;
    }



    // multer middelware provide the files in req.    

    /* this if block will check is there any profile_Image array and inside this array any path  present or not.
    If path  exists then only assign ...
    */
    console.log("req.files=====>>>>", req.files);
    if (req.files && Array.isArray(req.files.profile_image) && req.files.profile_image.length > 0) {
        profile_image_localPath = req.files.profile_image[0].path;
        // Uploading file in cloudinary. So it will take some time that's why use async await or promises;
        cloudinary_profile_image = await uploadFileInCLoudinary(profile_image_localPath);
        console.log("CloudinaryFile", cloudinary_profile_image);

    }




    const User = await user.create({
        name,
        email: checkedEmail,
        password: passwordVerifed,
        address,
        phone,
        profile_Image: cloudinary_profile_image?.url || ""
    })
    console.log("User registered=======> ", User);

    /* yah line main user/database main id se find karke  password or refershtoken ko  exclude kar raha hu select ke help se*/
    const createdUser = await user.findById(User._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new Error("Server Error");
    }
    console.log("createdUser=======> ", createdUser);

    return res.status(201).json({
        message: 'User has been created successfully!',
        data: createdUser
    })

}
export default registerController;

// --------------------------------------------------------------------------------
/* --------------------------------------------------------------------------------
 User model export default  korle {} diye import korte hoto na..
 -------------------------------------------------------------------------------- */
// --------------------------------------------------------------------------------

/*
. We have to  take  name,email,address,phnum,password from user.
. we have to check the validation like all fields are properly filled  or not
. Check if user is already register or not : for checking purpose use email and name .
. I am checking files is present or not inside request and if path is present then only  store the file in cloudinary .
. remove password from  payload/createdUser (we don't want to send password through json )
-----------------------------------------------------------------------

. if EVERY FILEDS ARE  PROPERLY FILL UP . THEN  CREATE AN USER  OBJECT AND STORE INTO DATABASE.

*/