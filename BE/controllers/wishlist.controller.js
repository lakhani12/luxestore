const wishlistService = require("../services/wishlist.service");

// add item to wishlist
module.exports.AddToWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const {productId} = req.body;

        const wishlist = await wishlistService.AddToWishlist({userId, productId});

        return res.status(200).json({message: "Item added to Wishlist", wishlist})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// get wishlist
module.exports.GetWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const items = await wishlistService.GetWishlist(userId);
        return res.status(200).json({items})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// remove from wishlist
module.exports.RemoveFromWishlist = async(req, res) =>{
    try {
        const userId = req.user.id;
        const {productId} = req.body;
        const wishlist = await wishlistService.RemoveFromWishlist({userId, productId});
        return res.status(200).json({message: "Item removed from Wishlist", wishlist})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}