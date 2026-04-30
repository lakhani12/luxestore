const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    { productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, quantity: Number, price: Number, total: Number },
  ],
  totalbill: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancel"],
    default: "pending",
  },
  trackingId: {
    type: String,
    default: "",
  },
  carrier: {
    type: String,
    default: "LuxePost Premium",
  },
  estimatedDelivery: {
    type: Date,
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    orderId: String,
    status: { type: String, default: 'captured' }
  }
}, { timestamps: true });

module.exports = mongoose.model("order", OrderSchema);
