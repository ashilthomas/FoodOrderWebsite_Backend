import express from "express"
import { coupanValidate, coupon, createCoupon } from "../Controller/couponController.js"
const couponRoute = express.Router()

couponRoute.get("/",coupon)
couponRoute.post("/",createCoupon)
couponRoute.post("/couponvalidate",coupanValidate)

export default couponRoute