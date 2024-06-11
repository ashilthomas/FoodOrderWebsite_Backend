import express from "express"
const foodRoute = express.Router()
import upload from "../middleware/fileUploader.js"
import { addFoodMenuItems, deletMenuItems, getallFoodMenuItems, itemFilter, searchMenuItems } from "../Controller/foodController.js";


foodRoute.post("/addfood",upload.single("image"),addFoodMenuItems)
foodRoute.get("/allfoods",getallFoodMenuItems)
foodRoute.delete("/:id",deletMenuItems)
foodRoute.get("/search",searchMenuItems)
foodRoute.get("/itemsfilter",itemFilter)
export default foodRoute;