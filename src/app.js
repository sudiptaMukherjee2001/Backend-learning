import express from "express"
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cors());

// Import router
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter)
export default app;