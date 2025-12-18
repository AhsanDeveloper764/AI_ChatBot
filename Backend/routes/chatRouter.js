const express = require("express")
const { createChat, getChat, deleteChat } = require("../controllers/chatController")
const protect = require("../middlewares/auth")
const chatRoute = express.Router()

chatRoute.get("/create",protect,createChat)
chatRoute.get("/get",protect,getChat)
chatRoute.post("/delete",deleteChat)

module.exports = chatRoute