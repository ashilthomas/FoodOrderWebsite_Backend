import express from "express"
import { addUser, loginUser, updateUser } from "../Controller/userController.js"
import authenticateUser from "../middleware/userAuth.js"
const userRoute = express.Router()

userRoute.post("/register",addUser)
userRoute.post("/login",loginUser)
userRoute.post("/userupdate",authenticateUser,updateUser)

export default userRoute

