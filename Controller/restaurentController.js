import { cloudinaryInstance } from "../Config/cloudinary.js";
import RestaurentModel from "../models/restaurantModel.js"


const addRestaurent = async(req,res)=>{


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
    
          const {title,cuisinetype,rating,openinghours, location}=req.body

          const imageUrl = result.url;

        const NewRestaurant = await new RestaurentModel({
            title,
            cuisinetype,
            rating,
            openinghours,
            location,
            restaurantimg:imageUrl
        })
        const restaurent = await NewRestaurant.save()

        if(!restaurent){
            return res.json({
                success:false,
                message:"restaurent not created"
            })
        }

        res.status(200).json({
            success:true,
            message:"successfully created resturent",
            restaurent
        })
    })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:"internal server error"
        })
    }
}

const getAllRestaurants = async(req,res)=>{
    try {
        const restaurant = await RestaurentModel.find({})
        if(!restaurant){
            return res.json({
                success:false,
                message:"no Restaurant found"

            })
        }
        res.status(200).json(restaurant)
    } catch (error) {
        console.log(error);
             res.json({
            success:false,
            message:"Internal server error"
        })
    }

}
const singleRestaurant = async(req,res)=>{
    const {id}=req.body
    console.log(id);
    try {

        const restaurant = await RestaurentModel.findOne({_id:id})

        if(restaurant.length == 0){
            res.json({
                success:false,
                message:"no restaurant found"
            })
        }
        res.json({
            success:true,
            restaurant
        })
        
    } catch (error) {
        res.status(404).json({
            success:false,
            message:"internal sever error"
        })
        
    }
}

export {addRestaurent,getAllRestaurants,singleRestaurant}