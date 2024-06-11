import express from "express"
import { createCoupon } from "../Controller/couponController.js"
const couponRoute = express.Router()

couponRoute.post("/",createCoupon)

export default couponRoute