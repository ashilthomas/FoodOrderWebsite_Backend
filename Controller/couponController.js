import CouponModel from "../models/couponModel.js";


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
    }
}

export {
    coupanValidate 
}