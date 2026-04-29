const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item } = req.body;

    if (!item || !item.productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const Exist = await cartModel.findOne({ userId });
    
    if (Exist) {
      const isProductInCart = Exist.items.some((val) => 
        val.productId.equals(item.productId)
      );

      if (isProductInCart) {
        return res.status(400).json({ message: "Product Already In Cart" });
      }
    }

    const cart = await cartService.addToCart({ userId, item });

    return res
      .status(200)
      .json({ message: "add item to cart successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get Cart
module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await cartService.GetCart(userId);

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }

    return res
      .status(200)
      .json({ message: "Cart Data Fetch Successfully", cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// remove single item from cart
module.exports.RemoveItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await cartService.RemoveSingleProduct({ userId, productId });

    return res
      .status(200)
      .json({ message: "Remove Item from Cart Sucessfully " });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
