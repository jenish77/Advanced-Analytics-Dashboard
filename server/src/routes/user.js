const express = require("express");
const router = express.Router();
const UserController = require("../controller/usercontroller");
const AdminController = require("../controller/admincontroller");

router.get("/get-user",UserController.getUsers);
router.get("/get-order",UserController.getorders);
router.get("/get-product",UserController.getProducts);
router.get("/get-transaction",UserController.getTransactions);
router.post("/generate-payment-link",UserController.generatePaymentLink);
router.post("/complete-payment",UserController.completePayment);
// router.get("/fetch-dataAnd-train-model",UserController.fetchDataAndTrainModel);



module.exports = router