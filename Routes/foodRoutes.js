import express from "express"
const foodRoute = express.Router()
import upload from "../middleware/fileUploader.js"
import { addFoodMenuItems } from "../Controller/foodController.js";


foodRoute.post("/addfood",upload.single("image"),addFoodMenuItems)
export default foodRoute;