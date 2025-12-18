const express = require("express")
const { userRegister, userLogin, getData, getPublishedImage } = require("../controllers/userController")
const  protect  = require("../middlewares/auth")

const router = express.Router()

router.post("/register",userRegister)
router.post("/login",userLogin)
router.get("/getbyid", protect, getData)
router.get("/published-images",getPublishedImage)

module.exports = router