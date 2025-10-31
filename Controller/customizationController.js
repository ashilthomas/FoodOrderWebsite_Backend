import FoodCustomizationModel from "../models/customizationModel.js";

const addFoodCustomization = async (req, res) => {
  const { sizeOptions, sauceOptions } = req.body;
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

  }
};
const getAllFoodCustomization = async(req,res)=>{
  try {
    const foodCustomization = await FoodCustomizationModel.find({})

    if(!foodCustomization || foodCustomization.length === 0){
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
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}
export {
  addFoodCustomization,
  getAllFoodCustomization

} ;
