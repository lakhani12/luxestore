const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productModel = require('./models/product.model');

dotenv.config();

const products = [
  {
    name: "Signature Gold Essential",
    description: "A timeless masterpiece of design and craftsmanship. Each piece is meticulously crafted from the finest materials.",
    stock: 15,
    price: 1299,
    discount: 10,
    isNewProduct: true,
    sku: "LXS-GOLD-001",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"],
    brand: "LuxeStore",
    category: "Exclusive"
  },
  {
    name: "Midnight Silk Chronograph",
    description: "Elegant timepiece with a midnight black finish and silk-smooth straps. Perfect for any formal occasion.",
    stock: 8,
    price: 2450,
    discount: 5,
    isNewProduct: true,
    sku: "LXS-CHRONO-002",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"],
    brand: "LuxeStore",
    category: "Watches"
  },
  {
    name: "Venetian Leather Tote",
    description: "Handcrafted Italian leather bag with spacious compartments and a sophisticated finish.",
    stock: 20,
    price: 890,
    discount: 0,
    isNewProduct: false,
    sku: "LXS-LEATHER-003",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"],
    brand: "LuxeStore",
    category: "Accessories"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB for seeding...");
    
    await productModel.deleteMany({});
    console.log("Cleared existing products.");
    
    await productModel.insertMany(products);
    console.log("Seeded initial products successfully!");
    
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
