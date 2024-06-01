import FoodCustomizationModel from "../models/customizationModel.js"

const addFoodCustomization= async(req,res)=>{
    const { sizeOptions, sauceOptions } = req.body;
    try {
        const newCustomization = new FoodCustomizationModel({

            sizeOptions,
            sauceOptions,
          });

          const customization = await newCustomization.save()
    } catch (error) {
        console.log(error);
    }
}

export default addFoodCustomization;