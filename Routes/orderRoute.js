import express from "express"
import { placeOrder } from "../Controller/orderController.js"
import { coupanValidate, coupon } from "../Controller/couponController.js"
const orderRoute = express.Router()

orderRoute.post("/placeorder",placeOrder)
orderRoute.post("/validatecoupon",coupanValidate)
orderRoute.post("/coupon",coupon)
export default orderRoute