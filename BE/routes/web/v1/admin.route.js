const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const { body } = require("express-validator");

// show all users
// login user --> check user is Admin? --> show all users
router.get(
  "/all/user",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.AllUser,
);

// Delete User
router.delete(
  "/user/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.deleteUser,
);

// update user (role, status, details)
router.put(
  "/user/:id",
  usermiddleware.authUser,
  middleware.authAdmin,
  adminController.updateUser,
);

module.exports = router;
