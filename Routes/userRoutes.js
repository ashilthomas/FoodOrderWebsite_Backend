import express from "express"
import { addUser, loginUser } from "../Controller/userController.js"
const userRoute = express.Router()

userRoute.post("/register",addUser)
userRoute.post("/login",loginUser)

export default userRoute

