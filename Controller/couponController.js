import CouponModel from "../models/couponModel.js";


const createCoupon = async(req,res)=>{
    const { code, discount, expirationDate, isActive,title,desc } = req.body;

  
   
    try {
        const newCoupon =  await new CouponModel({
            title:title,
            desc:desc,
            code:code,
            discount:discount,
            expirationDate:expirationDate,
            isActive: isActive !== undefined ? isActive : true 
          });

          const coupon = await newCoupon.save()
          if(!coupon){
            return res.json({
                success:false,
                message:"coupon not created"
            }
            )
            
          }

          res.status(200).json({
            success:true,
            message:"coupon added",
            coupon
          })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:"internal sever error"
        })
        
    }
}

const coupon = async(req,res)=>{
    try {
        
        const coupon = await CouponModel.find({})

        if(!coupon){
            return res.json({
                success:false,
                message:"no coupon available"
            })
        }

        res.status(200).json({
            success:true,
            coupon
        })
    } catch (error) {
        res.status(404).json({
            success:false,
            message:"internal server error"
        })
    }
}

const coupanValidate = async(req,res)=>{
    const { data } = req.body;
   const code =data.coupon
   
    try {
        const coupon = await CouponModel.findOne({code:code });
        console.log(coupon);
        if (!coupon){
            return res.send({
                success:false,
                message:"'Invalid coupon code'"
            });
        }
        if (new Date(coupon.expirationDate) < new Date()) {
            return res.json({
                success:false,
                message:"Coupon has expired"
            })
        }
        res.status(200).json({
            success:true,
            message:"coupon added",
            coupon
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:"internal server error"
        })
    }
}

export {
    createCoupon,
    coupanValidate,
    coupon
}