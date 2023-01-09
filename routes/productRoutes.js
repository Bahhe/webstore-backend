const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { verifyTokenAndAdmin } = require("../middleware/verifyJWT")

router
  .route("/")
  .get(productController.getAllProducts)
  .post(verifyTokenAndAdmin, productController.createNewProduct)
  .delete(verifyTokenAndAdmin, productController.deleteProduct)

router.route("/list").get(productController.listProducts)
router.route("/:id").patch(verifyTokenAndAdmin, productController.updateProduct)
router.route("/:id").get(productController.getProduct)

module.exports = router
