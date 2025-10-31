
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

      const { title, description, price, category, brand, restaurant, availability,customization} =
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
        restaurant: restaurant,
        customization:customization
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
  const { query: searchTerm } = req.query;

  try {
    const results = await MenuModel.find({
      $or: [
        { title: { $regex: new RegExp(searchTerm, 'i') } },
        { category: { $regex: new RegExp(searchTerm, 'i') } },
        { brand: { $regex: new RegExp(searchTerm, 'i') } },
        
      ]
    }).populate('restaurant');

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items found'
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




 
  const menuItemCategory = async(req,res)=>{
    try {
        const allMenuItems = await MenuModel.find({});


        const categories = Array.from(new Set(allMenuItems.map(items => items.category)));

        if (categories.length === 0) {
          return res.status(404).json({ success: false, message: "No categories available" });
        }

        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "internal server error" })
    }
  }

  const itemFilter = async (req, res) => {
    try {
      const { price, sort, cuisinetype } = req.query;

      // Build the query object
      let query = {};

      if (price && price !== 'all') {
        query.price = { $lte: parseInt(price) };
      }

      let menuItems = await MenuModel.find(query).populate('restaurant');

      // Don't return early if no items found, continue with filtering

      if (cuisinetype && cuisinetype !== 'all') {
        menuItems = menuItems.filter(item => item.restaurant && item.restaurant.cuisinetype === cuisinetype);
      }

      // Sort the items if sort parameter is provided
      if (sort === 'rating') {
        menuItems = menuItems.sort((a, b) => (b.restaurant?.rating || 0) - (a.restaurant?.rating || 0));
      } else if (sort === 'price') {
        menuItems = menuItems.sort((a, b) => a.price - b.price);
      }

      // Return the filtered and possibly sorted items
      res.json({ success: true, menuItems });
    } catch (error) {
      // Return the error message
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const pagination = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
  
    try {
      let query = MenuModel.find({});
      query = query.skip(skip).limit(limit);
  
      const items = await query;
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  const getCategoryItems = async (req, res) => {
    const { category } = req.query;

    try {
      const items = await MenuModel.find({ category: category }).populate("restaurant")
      if(items.length==0){
        return res.json({
          success:false,
          message:"no category items found"
        })
      }
      res.status(200).json({
        success:true,
        items
      });
    } catch (error) {
      res.status(500).json({
        success:false,
        message:"An error occurred while fetching the category items"
      });
    }
  };
  const restaurantItems = async(req,res)=>{
    const {id}=req.query


       try {

     const restaurantItem = await MenuModel.find({
       restaurant:id}).populate("restaurant")

       if(restaurantItem.length == 0){
         return res.json({
           success:false,
           message:"no restaurant items found"
         })
       }


       res.json({
         success:true,
         restaurantItem
       })

       } catch (error) {
       console.log(error);
       res.status(500).json({
         success:false,
         message:"internal server error"
       })
      }
  }

  const singleMenuItems = async(req,res)=>{
    const {id}=req.query
    try {

      const menuItem = await MenuModel.findOne({_id:id}).populate("customization")
      if(!menuItem){
        return res.json({
          success:false,
          message:"no items found"
        })
      }
      res.json({
        success:true,
        menuItem
      })

    } catch (error) {
      res.status(500).json({
        success:false,
        message:"Internal server error"
      })
      console.log(error);

    }
  }
  
export {
  addFoodMenuItems,
  getallFoodMenuItems,
  deletMenuItems,
  searchMenuItems,
  menuItemCategory,
  itemFilter,
  pagination,
  getCategoryItems,
  restaurantItems,
  singleMenuItems
};

