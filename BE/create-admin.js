const mongoose = require('mongoose');
const userModel = require('./models/user.model');
const dotenv = require('dotenv');

dotenv.config();

// Use MONGO_URL from .env or default to the correct 'ecommerce' database
const MONGODB_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${MONGODB_URI}...`);

    const adminEmail = "admin@luxestore.com";
    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists in this database.");
      process.exit(0);
    }

    const hashPassword = await userModel.hashPassword("Admin123!");
    
    const admin = await userModel.create({
      username: "Grandmaster Admin",
      email: adminEmail,
      password: hashPassword,
      role: "admin"
    });

    console.log("------------------------------------------");
    console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: Admin123!`);
    console.log("------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
