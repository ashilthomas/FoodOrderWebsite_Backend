import express from "express"
import { addRestaurent, getAllRestaurants, singleRestaurant } from "../Controller/restaurentController.js"
import upload from "../middleware/fileUploader.js"
const restaurentRoute = express.Router()

restaurentRoute.post("/addrestaurant",upload.single("restaurantimg"),addRestaurent)
restaurentRoute.get("/allrestaurant",getAllRestaurants)
restaurentRoute.post("/singlerestaurant",singleRestaurant)

export default restaurentRoute