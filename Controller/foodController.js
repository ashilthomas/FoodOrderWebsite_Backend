import { cloudinaryInstance } from "../Config/cloudinary.js";
import MenuModel from "../models/foodModel.js";

const addFoodMenuItems = async (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.send("file is not visible");
    }

    cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
      if (err) {
        console.log(err, "error");
        return res.status(500).json({
          success: false,
          message: "Error",
        });
      }

      const imageUrl = result.url;
      const {title,description,price,category,availability,brand,restaurantId}=req.body

      const newMenus = new MenuModel({
        title: title,
        description: description,
        price: price,
        category: category,
        // availability: availability,
        image: imageUrl,
        brand: brand,
        restaurant: restaurantId,
      });

      const menus = await newMenus.save();
        if (!menus) {
          return res.send("menus is not created");
        }
        return res.send(menus);
    
    });
  } catch (error) {}
};
export { addFoodMenuItems };
