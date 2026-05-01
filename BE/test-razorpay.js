require('dotenv').config();
const paymentService = require('./services/payment.service');

async function testRazorpay() {
  try {
    const order = await paymentService.createRazorpayOrder(500);
    console.log("Razorpay Order Created Successfully:", order.id);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create Razorpay order:", err);
    process.exit(1);
  }
}
testRazorpay();
