const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cartController')
// const verifyJwt = require('../middleware/verifyJWT')

router
  .route('/')
  .get(cartController.getAllCarts)
  .post(cartController.createNewCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart)

router.route('/:userId').get(cartController.getCart)

module.exports = router
