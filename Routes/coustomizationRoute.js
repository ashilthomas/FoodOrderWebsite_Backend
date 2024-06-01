import express from "express"
import addFoodCustomization from "../Controller/customizationController.js"
const coustomizationRoute = express.Router()


coustomizationRoute.post("/",addFoodCustomization)


export default coustomizationRoute