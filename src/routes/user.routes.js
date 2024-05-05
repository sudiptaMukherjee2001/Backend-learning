import { Router } from "express";

const router = Router();
//importing the controller file to use its functions.
import registerController from "../controllers/register.controller.js";
import {
    genarateNewAccesstoken,
    loginController,
    logoutController
} from "../controllers/login.controller.js";
import { upload } from "../middelware/multer.middelware.js";
import { verifyJwt } from "../middelware/auth.middelware.js";

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
router.route("/logIn").post(loginController)
router.route("/logOut").post(verifyJwt, logoutController);
router.route("/refresh-token").post(genarateNewAccesstoken)


export default router;