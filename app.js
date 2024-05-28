import express from "express";
import userRoute from "./Routes/userRoutes.js";
import connectDb from "./Config/db.js";
import cookieParser from "cookie-parser"
import "dotenv/config";

const app = express();
app.use(cookieParser())
connectDb();
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
