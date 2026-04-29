const express = require("express");
const router = express.Router();
const categoryController = require("../../../controllers/category.controller");
const userMiddleware = require("../../../middlewares/user.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

// Public route to get categories
router.get("/all", categoryController.getAllCategories);

// Admin only routes
router.post("/add", userMiddleware.authUser, adminMiddleware.authAdmin, categoryController.createCategory);
router.delete("/:id", userMiddleware.authUser, adminMiddleware.authAdmin, categoryController.deleteCategory);

module.exports = router;
