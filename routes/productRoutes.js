const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
// const verifyJWT = require('../middleware/verifyJWT')

router
  .route("/")
  .get(productController.getAllProducts)
  .post(/*verifyJWT,*/ productController.createNewProduct)
  .delete(/*verifyJWT,*/ productController.deleteProduct)

router.route("/list").get(productController.listProducts)
router.route("/:id").patch(/*verifyJWT,*/ productController.updateProduct)
router.route("/:id").get(productController.getProduct)

module.exports = router
