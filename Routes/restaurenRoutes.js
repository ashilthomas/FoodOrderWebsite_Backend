import express from "express"
import { addRestaurent, getAllRestaurants } from "../Controller/restaurentController.js"
import authenticateAdmin from "../middleware/adminAuth.js"
const restaurentRoute = express.Router()

restaurentRoute.post("/addrestaurant",addRestaurent)
restaurentRoute.get("/allrestaurant",authenticateAdmin,getAllRestaurants)

export default restaurentRoute