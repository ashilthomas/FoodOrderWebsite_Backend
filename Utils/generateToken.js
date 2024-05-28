import jwt from "jsonwebtoken"
import "dotenv/config"
const getToken = (req,res,next)=>{ 
 
    const options = {
        id: req.user._id,
        time:Date.now()
    }

       const token = jwt.sign(options,process.env.SKT,{expiresIn:"30min"})

        if(!token){
          return   res.status(500).json({
                success:false,
                message:"Token generation failed",
                

               })
        
        } 
                res.status(200).cookie("token",token).json({
                success:true,
                user:req.user,
                token,
                message:"logged in succesfully",
               
       })

}

export default getToken