import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

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

const loginUser = async(req,res)=>{
  console.log(req.body);
  const {password,email}=req.body
  try {
    const user = await UserModel.findOne({ email });
    if (!user) { 
        return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
    }
    res.status(200).json({ success: true, message: "Login successfully",user });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { addUser,loginUser };
