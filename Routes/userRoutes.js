import express from "express"
import { addUser, admin, checkuser, loginUser } from "../Controller/userController.js"
import authenticateAdmin from "../middleware/adminAuth.js"
import authenticateUser from "../middleware/userAuth.js"
const userRoute = express.Router()

userRoute.post("/register",addUser)
userRoute.post("/login",loginUser)
userRoute.get("/checkadmin",authenticateAdmin,admin)
userRoute.get("/checkuser",authenticateUser,checkuser)

export default userRoute

