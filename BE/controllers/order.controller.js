const orderService = require("../services/order.service");

// create order
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    const order = await orderService.CreateOrder({ userId, items });

    if (!order) {
      return res.status(404).json("Products not Found");
    }

    return res
      .status(200)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get order deatils and show order stauts
module.exports.GetOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await orderService.GetOrder(userId);

    if (!order) return res.status(404).json({ message: "Order Not Found !!" });

    return res
      .status(200)
      .json({ message: "Order Featch Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// get all orders for Admin
module.exports.GetAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await orderService.GetAllOrders();
    return res.status(200).json({ message: "All Orders Fetched", orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
