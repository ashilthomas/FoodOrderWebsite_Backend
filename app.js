import express from "express";
import userRoute from "./Routes/userRoutes.js";
import connectDb from "./Config/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import "dotenv/config";
import foodRoute from "./Routes/foodRoutes.js";
import restaurentRoute from "./Routes/restaurenRoutes.js";
import coustomizationRoute from "./Routes/coustomizationRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import couponRoute from "./Routes/couponRoute.js";
import cartRoute from "./Routes/CartRoute.js";

const app = express();
app.use(cookieParser())
connectDb();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/menus", foodRoute);
app.use("/api/v1/restaurent", restaurentRoute);
app.use("/api/v1/foodcoustom", coustomizationRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/coupon",couponRoute)
app.use("/api/v1/cart",cartRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
