import express from "express"
import { addToCart, getAllCartItems } from "../Controller/cartcontroller.js"
import userAuth from "../middleware/userAuth.js"

const cartRoute  = express.Router()

cartRoute.post("/addtocart",userAuth,addToCart)
cartRoute.get("/allcartitems",userAuth,getAllCartItems)

export default cartRoute 