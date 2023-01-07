const router = require("express").Router()
const userController = require("../controllers/userController")
// const verifyJWT = require('../middleware/verifyJWT')

router
  .route("/")
  .get(/*verifyJWT, */ userController.getAllUsers)
  .post(userController.createNewUser)
  .delete(/*verifyJWT, */ userController.deleteUser)
  .patch(/*verifyJWT, */ userController.updateUser)

router.route("/stats").get(/*verifyJWT, */ userController.getUsersStats)

module.exports = router
