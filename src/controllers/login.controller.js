import jwt from "jsonwebtoken";
import { user } from "../model/user.model.js";
const genarateAccessTokenAndRefreshtoken = async (userId) => {

    try {
        const User = await user.findById(userId)
        console.log("inside genarate func==>", User);
        const accessToken = await User.genarateAccessToken()

        const refreshtoken = await User.genarateRefreshToken();

        console.log("Inside genarateAccessToken====>", accessToken);
        console.log("Inside genarateRefreshtoken====>", refreshtoken);
        // storing refreshtoken in db
        User.refreshToken = refreshtoken;
        await User.save({ validateBeforeSave: false })
        return {
            accessToken,
            refreshtoken
        }

    } catch (error) {
        // res.status(500).json({ error: "Access token and refresh token haven't genarated" });
        console.log("error==>", error);
    }
}

const loginController = async (req, res, next) => {
    //   Log in todo's
    //  1. get user data from ===> req.body
    //  2. check if the email and password are filled or not . if  they are empty return an error message saying "email/Password is required"
    //  3. we have to find the email and password in db.
    //  4. compare the password with password which is stored in the database .
    //  -------------------now generate access token and refresh token---------------------
    //  5. generate accesstoken and refresh token and store refresh token in database
    //  6. store the accesstoken and refresh token to the cookies


    const { email, password } = req.body;
    console.log("Email", email);
    console.log("password", password);
    if (!(email || password)) {
        res.status(401).json({ message: "please provide an email and password" });
    }
    try {
        let User = await user.findOne({
            $or: [{ email }, { password }]
        })

        if (!User) {
            res.status(203).json({ message: "User is not present" })
        }
        const passwordCorrect = await User.isPasswordMatch(password)

        console.log("User", User);
        console.log("ispasswrodMatch", passwordCorrect);

        if (!passwordCorrect) {
            return res.status(401).json({ message: "unauthorized User" })
        }

        const { accessToken, refreshtoken } = await genarateAccessTokenAndRefreshtoken(User._id)

        console.log("accesstokens===>", accessToken);
        console.log("refreshToken===>", refreshtoken);

        const loggedInUser = await user.findOne(User._id).
            select('-password -refreshToken');
        console.log("loggedInUser", loggedInUser);

        // cookies will modifed from the server only. If we pass true to httpOnly and secure...
        const options = {
            httpOnly: true,
            secure: true
        }
        console.log("This is req", req.cookies);
        return res.status(200)
            .cookie("accesstoken", accessToken, options)
            .cookie("refreshtoken", refreshtoken, options)
            .json({
                message: "Authorized user",
                data: loggedInUser, accessToken, refreshtoken,

            })

    } catch (error) {
        res.status(101).json({ error: "unauthorized access" })
        console.log("error", error);

    }



}

/* Log out controller */
const logoutController = async (req, res) => {
    console.log("This is req from logout controller==>", req);
    try {
        const User = await user.findById(req.User._id);//auth.middelware code main req obj ke andhar User Obj ko dala gaya hein..
        User.refreshToken = ""
        User.save({ validateBeforeSave: false });
        console.log("Log out user", User);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(201)
            .clearCookie('accesstoken', options)
            .clearCookie('refreshtoken', options)
            .json({ data: {}, message: "Logged Out Successfully" })
    } catch (error) {

    }
}

/* Genarate new access token from refresh token  */

const genarateNewAccesstoken = async (req, res) => {
    const incommingRefreshToken = req?.cookies?.refreshtoken || req?.body?.refreshtoken;
    // console.log("this is req under genarateNewAccesstoken func==>", incommingRefreshToken);

    if (!incommingRefreshToken) {
        return res.status(400).send({ auth: false, msg: "No token provided." })
    }
    // now we have to verify the incomming refresh token with db refresh token
    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFERSH_TOKEN_SECRET);

        console.log("decoded-token", decodedToken?._id);

        const User = await user.findById(decodedToken?._id);
        console.log("this is req under genarateNewAccesstoken func==>", User);
        if (!User) {
            res.status(401).json({ error: "Invalid token" });
        }

        if (incommingRefreshToken !== User.refreshToken) {
            res.status(401).json({ error: "refresh token are not equal or expired" });
        }

        // refresh the accesstoken and genarate new refreshToken
        const { accessToken, newrefreshtoken } = await genarateAccessTokenAndRefreshtoken(decodedToken?._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accesstoken", accessToken, options)
            .cookie("refreshtoken", { refreshToken: newrefreshtoken }, options)
            .json({ message: "Access token refreshed and new refresh token genarated" })


    }

    catch (error) {
        console.log("error", error);
        res.status(400).json({ error: error });
    }
}

export { loginController, logoutController, genarateNewAccesstoken };