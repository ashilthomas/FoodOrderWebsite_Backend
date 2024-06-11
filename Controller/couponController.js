import CouponModel from "../models/couponModel.js";


const createCoupon = async(req,res)=>{
    const { code, discount, expirationDate, isActive } = req.body;
    console.log(req.body);
   
    try {
        const newCoupon =  await new CouponModel({
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
    const { code } = req.body;
    try {
        const coupon = await CouponModel.findOne({ code, isActive: true });
        if (!coupon){
            return res.status(400).send('Invalid coupon code');
        }
        if (new Date(coupon.expirationDate) < new Date()) {
            return res.status(400).send('Coupon has expired');
        }
        res.status(200).json(coupon)
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