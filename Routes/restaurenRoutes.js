import express from "express"
import { addRestaurent } from "../Controller/restaurentController.js"
const restaurentRoute = express.Router()

restaurentRoute.post("/addrestaurent",addRestaurent)

export default restaurentRoute