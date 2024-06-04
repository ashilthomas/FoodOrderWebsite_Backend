import CouponModel from "../models/couponModel.js";


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
    coupanValidate,
    coupon
}