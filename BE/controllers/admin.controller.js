const userModel = require("../models/user.model");
const adminService = require("../services/admin.service");
const { validationResult } = require("express-validator");

// get all user
module.exports.AllUser = async (req, res) => {
  try {
    const users = await adminService.getAllUser();

    return res.status(200).json({ message: "User Fetch Sucessfully", users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// delete user
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await adminService.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not Find" });
    }

    return res.status(200).json({ message: "User Delete Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update user
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Safety: don't allow updating sensitive/system fields directly
    delete updates._id;
    delete updates.password;
    delete updates.createdAt;
    delete updates.updatedAt;

    console.log("Admin Updating User:", userId, updates);

    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "Access Denied: Admin privileges required." });
    }

    const user = await adminService.updateUser(userId, updates);

    if (!user) {
      return res.status(404).json({ message: "Target user not found in archives." });
    }

    return res.status(200).json({ message: "Member record updated successfully.", user });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(400).json({ message: `Registry Update Failed: ${error.message}` });
  }
};
