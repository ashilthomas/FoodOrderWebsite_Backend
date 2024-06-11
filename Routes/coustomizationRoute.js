import express from "express"
import  {addFoodCustomization ,getAllFoodCustomization } from "../Controller/customizationController.js"
const coustomizationRoute = express.Router()


coustomizationRoute.post("/",addFoodCustomization)
coustomizationRoute.get("/",getAllFoodCustomization)


export default coustomizationRoute