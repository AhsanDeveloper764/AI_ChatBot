const express = require("express")
const protect = require("../middlewares/auth")
const MessageController = require("../controllers/messageController")

const msgRoutes = express.Router()

msgRoutes.post("/text",protect,MessageController.textMessageController)
msgRoutes.post("/image",protect,MessageController.imageMessageController)

module.exports = msgRoutes
