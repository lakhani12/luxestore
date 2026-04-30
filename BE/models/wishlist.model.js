const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }
  ],
}, { timestamps: true });


module.exports = mongoose.model("wishlist", WishlistSchema);