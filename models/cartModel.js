import mongoose from "mongoose";

const { Schema } = mongoose;

const CustomizationSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'menu', required: true },
  quantity: { type: Number, required: true },
  customization: [CustomizationSchema],
  price: { type: Number, required: true },

});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, default: 0 },
  totalCount:{type:Number, default: 0 }
}, { timestamps: true });

const CartModel = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default CartModel;