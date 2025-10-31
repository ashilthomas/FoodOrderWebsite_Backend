
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  title:{type:String},
  desc:{type:String},
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

const CouponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema);

export default CouponModel



