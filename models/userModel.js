import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({

    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password:{
        type:String,
        required: true,
        min: [6, 'Must be at least 6']
       
    }
    ,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
})
const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

export default UserModel;
