const { registerUser, loginUser, deleteUser } = require("../../controller/user/userController")
const { isAuthenticated } = require("../../middleware/isAuthenticated")

const router = require("express").Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/deleteUser").delete(isAuthenticated,deleteUser)

module.exports = router