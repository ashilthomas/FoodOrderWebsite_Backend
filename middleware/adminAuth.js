import jwt from "jsonwebtoken";
import "dotenv/config";
import UserModel from "../models/userModel.js";

const authenticateAdmin = async (req, res, next) => {
  // const token = req.cookies.token;
  const token = req.headers.authorization;
 
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = jwt.verify(token, process.env.SKT);
    req.user = user;
   

    const admin = await UserModel.findOne({ _id: req.user.id });
    

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    next();
  } catch (error) {
   
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export default authenticateAdmin;
