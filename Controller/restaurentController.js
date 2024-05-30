import RestaurentModel from "../models/restaurantModel.js"


const addRestaurent = async(req,res)=>{
    const {title,address,cuisinetype,rating,openinghours, location}=req.body
    try {
        const NewRestaurant = await new RestaurentModel({
            title,
            address,
            cuisinetype,
            rating,
            openinghours,
            location
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

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:"internal server error"
        })
    }
}


export {addRestaurent}