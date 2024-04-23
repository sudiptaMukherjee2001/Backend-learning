import { Router } from "express";

const router = Router();
//importing the controller file to use its functions.
import registerController from "../controllers/register.controller.js";
import loginController from "../controllers/login.controller.js";
import { upload } from "../middelware/multer.middelware.js";

// router.post("/register", registerController); //Register a new user
router.route("/register").post(
    // Before going to the registerController this middelware will execute for upload files...
    upload.fields([
        {
            name: 'profile_image',
            maxCount: 1
        },
        // {
        //     name: "resume",
        //     maxCount: 1
        // }

    ])
    ,
    registerController);


export default router;