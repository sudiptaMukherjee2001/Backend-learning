import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Import router
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter)
export default app;