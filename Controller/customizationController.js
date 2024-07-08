import FoodCustomizationModel from "../models/customizationModel.js";

const addFoodCustomization = async (req, res) => {
  const { sizeOptions, sauceOptions } = req.body;
  console.log(req.body);
  try {
    const newCustomization = new FoodCustomizationModel({
      sizeOptions,
      sauceOptions,
    });

    const customization = await newCustomization.save();
    res.status(200).json({
      success: true,
      message: "added costomization items",
      customization,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "internal server error",
    });

    console.log(error);
  }
};
const getAllFoodCustomization = async(req,res)=>{
  try {
    const foodCustomization = await FoodCustomizationModel.find({})

    if(!foodCustomization){
      return res.json({
        success:false,
        message:"no Customization available"
      })
    }
    res.status(200).json({
      success:true,
      foodCustomization
    })
  } catch (error) {
    
  }
}
export {
  addFoodCustomization,
  getAllFoodCustomization

} ;
