const router = require("express").Router()
const userController = require("../controllers/userController")
const { verifyJWT, verifyTokenAndAdmin } = require("../middleware/verifyJWT")

router
  .route("/")
  .get(verifyTokenAndAdmin, userController.getAllUsers)
  .post(userController.createNewUser)
  .delete(verifyJWT, userController.deleteUser)
  .patch(verifyJWT, userController.updateUser)

router.route("/:id").get(userController.getUser)

module.exports = router
