const express = require("express")
const router = express.Router()
const orderController = require("./../controllers/orderController")
const { verifyTokenAndAdmin, verifyJWT } = require("./../middleware/verifyJWT")

router
  .route("/")
  .get(verifyTokenAndAdmin, orderController.getAllOrders)
  .post(orderController.createNewOrder)
  .patch(verifyJWT, orderController.updateOrder)
  .delete(verifyJWT, orderController.deleteOrder)

module.exports = router
