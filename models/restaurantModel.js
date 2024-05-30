import mongoose, { Schema } from "mongoose";

const restaurentSchema = new Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    cuisinetype: { type: String, required: true },
    rating: { type: Number, required: true },
    openinghours: { type: Number, default: true },
    location: { type: String, required: true },
   
    
 });

 const RestaurentModel = mongoose.model.restaurent || mongoose.model("restaurents", restaurentSchema);

export default RestaurentModel;