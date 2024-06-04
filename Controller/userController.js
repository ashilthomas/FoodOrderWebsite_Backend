import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config"
import getToken from "../Utils/generateToken.js"

const saltRounds = 10;

const addUser = async (req, res) => {

  const { name, email, password } = req.body;

  try {
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      return res.json({
        success: false,
        message: "Email already exists",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
  }



    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter password with more than 8 characters",
      });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      name,
      email,
      password: hash,
    });

    const user = await newUser.save();

    res.status(200).json({
      success: true,
      message: "Successfully created account",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res,next) => {

  const { password, email } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.user = user

    getToken(req,res,next)

  

    
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUser =async(req,res)=>{
       try {
        
       } catch (error) {
        
       }
}


export { addUser,loginUser,updateUser };

