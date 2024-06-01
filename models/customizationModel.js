import mongoose, { Schema } from "mongoose";




const optionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isSelected: { type: Boolean, default: false }
});


const foodCustomizationSchema = new Schema({
  sizeOptions: [optionSchema],
  sauceOptions: [optionSchema],
});

// Create the model
const FoodCustomizationModel = mongoose.model('FoodCustomization', foodCustomizationSchema);

export default FoodCustomizationModel;