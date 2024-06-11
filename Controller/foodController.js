
import { cloudinaryInstance } from "../Config/cloudinary.js";
import MenuModel from "../models/foodModel.js";
import fs from "fs";

const addFoodMenuItems = async (req, res) => {
  try {
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
      const { title, description, price, category, brand, restaurantId,availability } =
        req.body;

      const newMenus = new MenuModel({
        title: title,
        description: description,
        price: price,
        category: category,
        availability: availability,
        localImagePath: req.file.path,
        image: imageUrl,
        brand: brand,
        restaurant: restaurantId,
      });

      const menus = await newMenus.save();
      if (!menus) {
        return res.send({
          success:false,
          message:"menus is not created",
          
        });
      }
      res.status(200).json({
        success:true,
        message:"food item added",
        menus
      })
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getallFoodMenuItems = async (req, res) => {
  try {
    const allMenus = await MenuModel.find({}).populate("restaurant");

    if (!allMenus) {
      return res.json({
        success: false,
        message: "no items found",
      });
    }

    res.status(200).json({
      success: true,
      allMenus,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletMenuItems = async (req, res) => {
  const id = req.params.id;
  try {
    const menu = await MenuModel.findById(id);
    if (!menu) {
      return res.json({
        success: false,
        message: "No item found",
      });
    }

    
    const localFilePath = menu.localImagePath; 
    if (localFilePath) {
      fs.unlink(localFilePath, async (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }

        await MenuModel.findByIdAndDelete(id);
        res.status(200).json({
          success: true,
          message: "deleted",
        });
      });
    } else {
   
      await MenuModel.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "deleted",
      });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const searchMenuItems = async (req, res) => {
    const { title, category, brand, restaurant, cuisinetype } = req.query;
  
    let filter = {};
  
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }
  
  
    try {
     
      const pipeline = [
        {
          $match: filter
        },
        {
          $lookup: {
            from: 'restaurents', 
            localField: 'restaurant', 
            foreignField: '_id', 
            as: 'restaurant' 
          }
        },
        {
          $unwind: '$restaurant' 
        }
      ];
 
  
      let restaurantMatch = {};
    
      if (restaurant) {
        restaurantMatch['restaurant.title'] = { $regex: restaurant, $options: 'i' }; 
      }
      if (cuisinetype) {
        restaurantMatch['restaurant.cuisinetype'] = { $regex: cuisinetype, $options: 'i' };
      }
  

      if (Object.keys(restaurantMatch).length > 0) {
        pipeline.push({ $match: restaurantMatch });
      }
  
  
      const results = await MenuModel.aggregate(pipeline);
  
      if (results.length === 0) {
        return res.json({
          success: false,
          message: "Item not found"
        });
      }
  
     
      res.status(200).json(results);
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
 
  const menuItemCategory = async(req,res)=>{
    try {
        const allMenuItems = await ProductModel.find({});
    
     
        const categories = Array.from(new Set(allMenuItems.map(items => items.category)));
    
        if (categories.length === 0) {
          return res.status(404).json({ success: false, message: "No categories available" });
        }
    
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json("internal server error")
    }
  }

  const itemFilter = async (req, res) => {
    try {
      const menuItems = await MenuModel.find({
        "price": { $lte: req.query.price }
      });
  
      if (menuItems.length == 0) {
        return res.json("error");
      }
  
      res.json(menuItems);
    } catch (error) {
      res.json(error);
    }
  };
  
export {
  addFoodMenuItems,
  getallFoodMenuItems,
  deletMenuItems,
  searchMenuItems,
  menuItemCategory,
  itemFilter
};
