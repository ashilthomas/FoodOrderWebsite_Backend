import CartModel from "../models/cartModel.js";
import MenuModel from "../models/foodModel.js";


const addToCart = async (req, res) => {
  const { productId, quantity, customization } = req.body;
 
  const userId = req.user.id
 

  try {
    // Find the cart for the user
    let cart = await CartModel.findOne({ userId });

    const getProductBasePrice = async (productId) => {
      const product = await MenuModel.findOne({ _id: productId });
      return product ? product.price : 0;
    };

    const itemBasePrice = await getProductBasePrice(productId);

    const customizationTotalPrice =
      customization?.reduce((acc, option) => acc + option.price, 0) || 0;
    const itemTotalPrice = (itemBasePrice + customizationTotalPrice) * quantity;

    if (cart) {
      // Cart exists, check if the item is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Item exists in the cart, update its quantity and customization
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
        productItem.customization = customization;
        productItem.price = itemTotalPrice;
        cart.items[itemIndex] = productItem;

        // Recalculate total price for the entire cart
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        cart.totalCount = cart.items.length;
        cart = await cart.save();
        return res.status(201).json({ success: true, message: "Item quantity updated in cart", cart });
      } else {
        // Item does not exist in the cart, add it
        cart.items.push({
          productId,
          quantity,
          customization,
          price: itemTotalPrice,
        });

        // Recalculate total price for the entire cart
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        cart.totalCount = cart.items.length;
        cart = await cart.save();
        return res.status(201).json({ success: true, message: "Item added to cart successfully", cart });
      }
    } else {
      // No cart for the user, create a new cart
      const newCart = await CartModel.create({
        userId,
        items: [{ productId, quantity, customization, price: itemTotalPrice }],
        totalPrice: itemTotalPrice,
        totalCount: 1
      });

      res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        cart: newCart,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};


const updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await CartModel.findOne({ userId });
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = quantity;
        cart.items[itemIndex] = productItem;
        cart.totalPrice = cart.items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        cart = await cart.save();
        return res.status(200).send(cart);
      } else {
        return res.status(404).send("Item not found in cart");
      }
    } else {
      return res.status(404).send("Cart not found");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  try {
    let cart = await CartModel.findOne({ userId });
    if (cart) {
      // Find the item to remove
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Remove the item from the array
        cart.items.splice(itemIndex, 1);

        // Recalculate total price and count
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
        cart.totalCount = cart.items.length;

        // If cart is empty after removal, we could delete it, but let's keep it for now
        cart = await cart.save();

        return res.status(200).json({
          success: true,
          message: "Item removed from cart successfully",
          cart
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart"
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getAllCartItems = async (req, res) => {

  const userId = req.user.id
 

  try {
    const cart = await CartModel.find({
userId:userId
    }).populate({
      path: "items.productId",
      model: "menu",
    });

    if (cart.length == 0) {
      return res.json({
        success: false,
        message: "no cart found",
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "internal server error",
    });
    console.log(error);
  }
};
export { addToCart, updateCartItem, removeItemFromCart, getAllCartItems };
