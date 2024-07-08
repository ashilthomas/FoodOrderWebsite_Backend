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
  const userId = req.user.id
 



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
        message: "Payement Successfully",
      });
    }

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email.email,
      subject: "conform order",
      text: `Dear Customer,

Thank you for your order from [Restaurant Name]! We are delighted to prepare your delicious meal. Here are the details of your order:

Order Number: ${razorpay_order_id}
Order Date: ${new Date().toLocaleDateString()}

  

Total Amount: 

Delivery Address: [Customer Address]

Estimated Delivery Time: [Delivery Time]

Special Instructions: [Special Instructions]

If you need to make any changes to your order or have any questions, please contact us at [Restaurant Phone Number] or reply to this email.

We hope you enjoy your meal and thank you for choosing [Restaurant Name]!

Best regards,

[Restaurant Name] Team
[Restaurant Website]
[Restaurant Address]
[Restaurant Phone Number]`,
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
  const userId = req.user.id

  try {
    // const orderItems = await OrderModel.find({user:userId}).populate('orderItems.cart')
    // const orderItems = await OrderModel.find({ user: userId }).populate({
    //   path: 'orderItems.cart',
    //   select: 'items.productId'
    // });
    const orderItems = await OrderModel.find({ user: userId }).populate({
      path: "orderItems.cart",
      populate: {
        path: "items.productId", // Populate productId within items
        model: "menu", // Make sure this is the correct model name
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
    // Find the order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the cart associated with the order items
    const cartId = order.orderItems[0]?.cart;

    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Remove the specific product from the cart items
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Update the total price and total count
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    cart.totalCount = cart.items.length;

    await cart.save();

    await order.save();
    if (cart.items.length == 0) {
      await OrderModel.findByIdAndDelete(orderId);
    }

    res.status(200).json({ success: true, message: "order canceld", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// const conformOrder = async(req,res)=>{

// }

export { placeOrder, verifyOrder, allOrderItems, deleteOrder };
