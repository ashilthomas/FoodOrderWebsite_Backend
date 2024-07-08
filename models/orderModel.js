import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart",  },
  

   
});

const orderSchema = new Schema({
    address:{type:Object},
    deliveryStatus:{
        type: String,
        enum: ["pending", "deliverd","canceled","shipped"],
        default: "shipped",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    orderItems: [orderItemSchema],
    razorpay_order_id: {
        type: String,
        required: true,
      },
      razorpay_payment_id: {
        type: String,
        required: true,
      },
      razorpay_signature: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
});

const OrderModel = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default OrderModel;
