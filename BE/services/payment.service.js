const crypto = require('crypto');

let razorpay;
try {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
  });
} catch (err) {
  console.warn("Razorpay package not installed. Real payments will fail, but Demo Mode will work.");
}

module.exports.createRazorpayOrder = async (amount, currency = 'INR') => {
  // If keys are missing, return dummy order for testing
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId || keyId.trim() === '' || keyId === 'rzp_test_placeholder') {
    return {
      id: `order_dmy_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100),
      currency: currency,
      status: 'created'
    };
  }

  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw error;
  }
};

module.exports.verifyPayment = (razorpayOrderId, razorpayPaymentId, signature) => {
  // Always verify success for dummy orders
  if (razorpayOrderId.startsWith('order_dmy_')) return true;

  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};
