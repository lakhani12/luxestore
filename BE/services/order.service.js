const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");


// create order
module.exports.CreateOrder = async ({ userId, items, paymentDetails }) => {
  let totalAmount = 0;

  let orderItems = [];

  for (let item of items) {
    const productId = item.productId;
    const product = await productModel.findOne({ _id: productId });

    if (!product) throw new Error("Product Not Found");

    const itemsTotal = product.price * item.quantity;

    totalAmount += itemsTotal;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemsTotal,
    });
  }

  const order = await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
    paymentDetails,
  });

  // Clear the cart after successful order creation
  await cartModel.findOneAndDelete({ userId });

  return order;
};

// get order history or show order
module.exports.GetOrder = async(userId)=>{
    return await orderModel.find({userId}).populate("items.productId");
}

// get all orders for Admin
module.exports.GetAllOrders = async () => {
    return await orderModel.find({}).populate("items.productId").populate("userId", "username email");
};

// update order status
module.exports.UpdateOrderStatus = async (orderId, status) => {
  const updatedOrder = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { returnDocument: 'after' }
  ).populate("userId", "username email");

  if (!updatedOrder) {
    throw new Error("Order not found");
  }

  return updatedOrder;
};