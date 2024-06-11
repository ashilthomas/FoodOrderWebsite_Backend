import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
    quantity: { type: Number, required: true }
});

const orderSchema = new Schema({
    address:{type:Object},
    deliveryStatus:{
        type: String,
        enum: ["pending", "deliverd","canceled"],
        default: "shipped",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    orderItem: [orderItemSchema]
});

const OrderModel = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default OrderModel;
