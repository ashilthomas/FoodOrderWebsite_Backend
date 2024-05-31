import { log } from "console";
import { cloudinaryInstance } from "../Config/cloudinary.js";
import MenuModel from "../models/foodModel.js";
import RestaurentModel from "../models/restaurantModel.js";
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
      const { title, description, price, category, brand, restaurantId } =
        req.body;

      const newMenus = new MenuModel({
        title: title,
        description: description,
        price: price,
        category: category,
        // availability: availability,
        localImagePath: req.file.path,
        image: imageUrl,
        brand: brand,
        restaurant: restaurantId,
      });

      const menus = await newMenus.save();
      if (!menus) {
        return res.send("menus is not created");
      }
      return res.json(menus);
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

    // Delete the file from the server using the local file path
    const localFilePath = menu.localImagePath; // Use the stored local file path
    if (localFilePath) {
      fs.unlink(localFilePath, async (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }

        // Delete the menu item from the database
        await MenuModel.findByIdAndDelete(id);
        res.status(200).json({
          success: true,
          message: "deleted",
        });
      });
    } else {
      // If there is no local file path, just delete the menu item
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
      filter.title = { $regex: title, $options: "i" }; // Case-insensitive regex search
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }
  
  
    try {
      // Constructing the aggregation pipeline
      const pipeline = [
        {
          $match: filter // Initial match with menu item fields
        },
        {
          $lookup: {
            from: 'restaurents', // The name of the restaurant collection
            localField: 'restaurant', // Field in the MenuModel
            foreignField: '_id', // Field in the Restaurant model
            as: 'restaurant' // Output array field
          }
        },
        {
          $unwind: '$restaurant' // Deconstruct array to object
        }
      ];
 
  
      let restaurantMatch = {};
    
      if (restaurant) {
        restaurantMatch['restaurant.title'] = { $regex: restaurant, $options: 'i' }; // Case-insensitive regex search for restaurant name
      }
      if (cuisinetype) {
        restaurantMatch['restaurant.cuisinetype'] = { $regex: cuisinetype, $options: 'i' }; // Case-insensitive regex search for cuisine type
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
  
      console.log("Results: ", results);
      res.status(200).json(results);
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ error: "An error occurred while fetching the data." });
    }
  };
  
 
  


export {
  addFoodMenuItems,
  getallFoodMenuItems,
  deletMenuItems,
  searchMenuItems,
};
