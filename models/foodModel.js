import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema({
   title: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: Number, required: true },
   category: { type: String, required: true },
   availability: { type: Boolean, default: true },
   image: { type: String, required: true },
   brand: { type: String, required: true },
   restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant",  },
});

const MenuModel = mongoose.models.Menu || mongoose.model("Menu", foodSchema);

export default MenuModel;
