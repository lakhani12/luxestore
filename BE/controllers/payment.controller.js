const paymentService = require("../services/payment.service");

module.exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Creating payment order for amount:", amount);
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const order = await paymentService.createRazorpayOrder(amount);
    console.log("Order created successfully:", order.id);
    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Payment Order Creation Failed:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isVerified = paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isVerified) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
