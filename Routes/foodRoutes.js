import express from "express"
const foodRoute = express.Router()
import upload from "../middleware/fileUploader.js"
import { addFoodMenuItems, deletMenuItems, getCategoryItems, getallFoodMenuItems, itemFilter, pagination, restaurantItems, searchMenuItems, singleMenuItems } from "../Controller/foodController.js";


foodRoute.post("/addfood",upload.single("image"),addFoodMenuItems)
foodRoute.get("/allfoods",getallFoodMenuItems)
foodRoute.delete("/:id",deletMenuItems)
foodRoute.get("/search",searchMenuItems)
foodRoute.get("/itemsfilter",itemFilter)
foodRoute.post("/categoryitems",getCategoryItems)
foodRoute.post("/restaurantitems",restaurantItems)
foodRoute.post("/singlemenuitems",singleMenuItems)

foodRoute.get("/pagination",pagination)
export default foodRoute;