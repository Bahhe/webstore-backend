const express = require("express")
const router = express.Router()
const orderController = require("./../controllers/orderController")
const { verifyTokenAndAdmin } = require("./../middleware/verifyJWT")

router
  .route("/")
  .get(verifyTokenAndAdmin, orderController.getAllOrders)
  .post(orderController.createNewOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder)

module.exports = router
