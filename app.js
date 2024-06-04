import express from "express";
import userRoute from "./Routes/userRoutes.js";
import connectDb from "./Config/db.js";
import cookieParser from "cookie-parser"
import "dotenv/config";
import foodRoute from "./Routes/foodRoutes.js";
import restaurentRoute from "./Routes/restaurenRoutes.js";
import coustomizationRoute from "./Routes/coustomizationRoute.js";
import orderRoute from "./Routes/orderRoute.js";

const app = express();
app.use(cookieParser())
connectDb();
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/menus", foodRoute);
app.use("/api/v1/restaurent", restaurentRoute);
app.use("/api/v1/foodcoustom", coustomizationRoute);
app.use("/api/v1/order", orderRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
