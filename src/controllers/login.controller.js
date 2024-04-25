import { user } from "../model/user.model.js";
const genarateAccessTokenAndRefreshtoken = async (userId) => {

    try {
        const User = await user.findOne(userId)
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
        res.status(500).json({ error: "Access token and refresh token haven't genarated" });
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

    // Pending task remove password and refresh token from login user
    // bug tokens are undefined

    const { email, password } = req.body;
    console.log("Email", email);
    console.log("password", password);
    if (!email || !password) {
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
            select('-password -refreshtoken');
        console.log("loggedInUser", loggedInUser);


        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accesstoken", accessToken, options)
            .cookie("refreshtoken", refreshtoken, options)
            .json({
                data: loggedInUser,
                message: "Authorized user",

            })


    } catch (error) {
        res.status(101).json({ error: "unauthorized access" })
        console.log("error", error);

    }



}

export default loginController;