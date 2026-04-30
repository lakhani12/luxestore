const orderService = require("../services/order.service");
const emailService = require("../services/email.service");

// create order
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const { items, paymentDetails } = req.body;

    const order = await orderService.CreateOrder({ userId, items, paymentDetails });

    if (!order) {
      return res.status(404).json("Products not Found");
    }

    if (!userEmail) {
      console.warn(`User ${userId} has no email address associated. skipping email notification.`);
    } else {
      // Send confirmation email and wait for it to ensure it works
      try {
        await emailService.sendOrderConfirmation(userEmail, order);
      } catch (err) {
        console.error("Order confirmation email failed to send, but order was created:", err);
      }
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

// update order status
module.exports.UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await orderService.UpdateOrderStatus(id, status);
    
    // Send status update email if user has an email address
    if (updatedOrder.userId && updatedOrder.userId.email) {
      emailService.sendStatusUpdateEmail(updatedOrder.userId.email, updatedOrder, status).catch(err => {
        console.error("Status update email failed:", err);
      });
    }

    return res.status(200).json({ message: "Order Status Updated", updatedOrder });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
