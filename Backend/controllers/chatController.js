const chatModel = require("../models/chat")

// API Controller for creating a new chatx
const createChat = async (req,resp) => {
    try {
        const userId = req.user._id
        const chatData = {
            userId,
            messages:[],
            name:"New Chat",
            userName:req.user.name
        }
        await chatModel.create(chatData)
        resp.json({success:true,message:"Chat Created"})
    } catch (error) {
        resp.json({success:false,error:error.message})
    }
}
// API controller for getting all chats
const getChat = async (req,resp) => {
    try {
        const userId = req.user._id
        const chats = await chatModel.find({userId}).sort({updatedAt:-1})
        resp.json({success:true,chats}) 
    } catch (error) {
        resp.json({success:false,error:error.message})
    }
}

// API controller for delete chats
const deleteChat = async (req,resp) => {
    try {
        const userId = req.user._id
        const {chatId} = req.body
        await chatModel.deleteOne({_id:chatId,})
        resp.json({success:true,chats}) 
    } catch (error) {
        resp.json({success:false,error:error.message})
    }
}

module.exports = {createChat,getChat,deleteChat}
