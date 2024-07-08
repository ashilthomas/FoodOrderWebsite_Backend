import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config"
import getToken from "../Utils/generateToken.js"

const saltRounds = 10;

const addUser = async (req, res,next) => {

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
    req.user = user
    

    getToken(req,res,next)
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

const admin =async(req,res)=>{
  const adminId = req.user.id
       try {
      

        const isadmin = await UserModel.findOne({_id:adminId})

        if(!isadmin){
          return res.json({ message: "authentication failed", success: false });
        }
        res.json(({
          success:true,
          message:"Athenticate admin"
        }))
       } catch (error) {
        console.log(error);
        res.json({ message: "authentication failed", success: false })
       }
}


const checkuser = async(req,res)=>{
 
  const userId = req.user.id
  console.log(userId);


  try {
    const user = await UserModel.findOne({_id:userId})
    if(!user){
      return res.json({ message: "authentication failed", success: false });
    }
    res.json(({
      success:true,
    
    }))
   } catch (error) {
    console.log(error);
    res.json({ message: "authentication failed", success: false })
   }
}

export { addUser,loginUser,admin,checkuser };

