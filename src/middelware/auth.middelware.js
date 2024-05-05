import jwt from "jsonwebtoken";
import { user } from "../model/user.model.js";

export const verifyJwt = async (req, res, next) => {
    try {

        const token = req?.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "No Token Provided" });
            return;
        }
        const decodeToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const User = await user.findById(decodeToken._id);
        if (!User) {
            res.status(404).send('The user is not found');
            return;
        }
        req.User = User;
        next();
    } catch (error) {
        console.log("error==>", error);
        res.status(403).json({ message: "Invalid Token" })
    }

}