import express from "express"
const foodRoute = express.Router()
import upload from "../middleware/fileUploader.js"
import { addFoodMenuItems, deletMenuItems, getCategoryItems, getallFoodMenuItems, itemFilter, pagination, restaurantItems, searchMenuItems, singleMenuItems, menuItemCategory } from "../Controller/foodController.js";


foodRoute.post("/addfood",upload.single("image"),addFoodMenuItems)
foodRoute.get("/allfoods",getallFoodMenuItems)
foodRoute.delete("/:id",deletMenuItems)
foodRoute.get("/search",searchMenuItems)
foodRoute.get("/itemsfilter",itemFilter)
foodRoute.get("/categoryitems",getCategoryItems)
foodRoute.get("/restaurantitems",restaurantItems)
foodRoute.get("/singlemenuitems",singleMenuItems)
foodRoute.get("/menuItemCategory",menuItemCategory)

foodRoute.get("/pagination",pagination)
export default foodRoute;
