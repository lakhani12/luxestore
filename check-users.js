const mongoose = require("mongoose");
const userModel = require("./BE/models/user.model");
const dotenv = require("dotenv");
dotenv.config({ path: "./BE/.env" });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/luxestore");
    const users = await userModel.find();
    console.log("Current Users in DB:");
    users.forEach(u => {
      console.log(`- Username: ${u.username}, Email: ${u.email}, Role: ${u.role}, isActive: ${u.isActive}, ID: ${u._id}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
