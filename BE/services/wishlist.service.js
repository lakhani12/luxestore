const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist = async ({userId, productId}) => {
    if (!productId) throw new Error("Product ID is required");

    let wishlist = await wishlistModel.findOne({userId});

    if(!wishlist) {
        wishlist = new wishlistModel({userId, products: []});
    }

    // Fallback for existing records created with the old schema
    if (!wishlist.products) {
        wishlist.products = [];
    }

    // Check if product already exists in wishlist
    const exists = wishlist.products.some(p => p && p.toString() === productId.toString());

    if (!exists) {
        wishlist.products.push(productId);
    }
    
    return await wishlist.save();
}

// get wishlist items
module.exports.GetWishlist = async (userId) => {
    const wishlist = await wishlistModel.findOne({ userId }).populate("products");
    
    if (!wishlist) return [];
    if (!wishlist.products) return [];

    // Filter out null products
    return wishlist.products.filter(p => p !== null);
}

// remove item from wishlist
module.exports.RemoveFromWishlist = async ({userId, productId}) => {
    let wishlist = await wishlistModel.findOne({userId});
    if(!wishlist || !wishlist.products) return null;

    wishlist.products = wishlist.products.filter(p => p && p.toString() !== productId.toString());
    return await wishlist.save();
}