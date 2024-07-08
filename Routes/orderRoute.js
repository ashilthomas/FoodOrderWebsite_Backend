import express from "express"
import { allOrderItems, deleteOrder, placeOrder, verifyOrder } from "../Controller/orderController.js"
import userAuth from "../middleware/userAuth.js"

const orderRoute = express.Router()

orderRoute.post("/placeorder",userAuth,placeOrder)
orderRoute.post("/verifyorder",userAuth,verifyOrder)
orderRoute.get("/allorderitems",userAuth,allOrderItems)
orderRoute.post("/deleteorder",deleteOrder)

// orderRoute.post("/validatecoupon",coupanValidate)
// orderRoute.post("/coupon",coupon)
export default orderRoute