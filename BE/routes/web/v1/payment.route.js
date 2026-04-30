const express = require("express");
const router = express.Router();
const paymentController = require("../../../controllers/payment.controller");
const middleware = require("../../../middlewares/user.middleware");

router.post("/create-order", middleware.authUser, paymentController.createOrder);
router.post("/verify-payment", middleware.authUser, paymentController.verifyPayment);

module.exports = router;
