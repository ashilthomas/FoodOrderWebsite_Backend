import OrderModel from "../models/orderModel.js";
import transporter from "../Config/nodemailer.js";
import "dotenv/config";
import razorpayInstance from "../Config/payment.js";
import crypto from "crypto";
import CartModel from "../models/cartModel.js";
import UserModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOrder = async (req, res) => {
  
  const userId = req.user.id;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cartItems,
  } = req.body;

  try {
    const email = await UserModel.findOne({ _id: userId });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "s")
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const payment = new OrderModel({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user: userId,
        orderItems: cartItems.map((item) => ({ cart: item._id })),
      });

      await payment.save();

      // await CartModel.findByIdAndDelete(cartId);

      res.json({
        message: "Payment Successfully",
        success: true
      });
    } else {
      res.status(400).json({
        message: "Payment verification failed",
        success: false
      });
    }

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.email,
      subject: "conform order",
      text: `Dear Customer,

Thank you for your order We are delighted to prepare your delicious meal. 

Order Number: ${razorpay_order_id}
Order Date: ${new Date().toLocaleDateString()}

    
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

const allOrderItems = async (req, res) => {
  const userId = req.user.id;

  try {
    // const orderItems = await OrderModel.find({user:userId}).populate('orderItems.cart')
    // const orderItems = await OrderModel.find({ user: userId }).populate({
    //   path: 'orderItems.cart',
    //   select: 'items.productId'
    // });
    const orderItems = await OrderModel.find({
      user: userId,
    }).populate({
      path: "orderItems.cart",
      populate: {
        path: "items.productId",
        model: "menu",
      },
    });

    res.send(orderItems);
  } catch (error) {
    console.log(error);
  }
};
const deleteOrder = async (req, res) => {
  const { orderId, productId } = req.body;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const cartId = order.orderItems[0]?.cart;

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    cart.totalCount = cart.items.length;

    await cart.save();

    await order.save();
    if (cart.items.length == 0) {
      await OrderModel.findByIdAndDelete(orderId);
    }

    res.status(200).json({ success: true, message: "order cancelled", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export { placeOrder, verifyOrder, allOrderItems, deleteOrder };
