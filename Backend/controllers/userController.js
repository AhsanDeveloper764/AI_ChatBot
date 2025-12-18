const userModel = require("../models/user");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const chatModel = require("../models/chat");

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
}

// ApI to register user
const userRegister = async (req,resp) => {
    const {name,email,password} = req.body;
    try {
        const userExist = await userModel.findOne({email})
        if(userExist){
            resp.json({success:false,message:"User Already Exist"})
        }
        const user = await userModel.create({name,email,password})
        const token = generateToken(user._id)  //mongodb generated id by default
        resp.json({success:true,token:token})
    } catch (error) {
        resp.json({success:false,message:error.message})
    }
}

// API To Login User
const userLogin = async (req,resp) => {
    const {email,password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(isMatch){
                const token = generateToken(user._id)
                return resp.json({success:true,token:token})
            }
            resp.json({success:false,message:"User Already Exist"})
        }
        return resp.status(500).json({success:false,message:"Invalid email or Username"})
    } catch (error) {
        resp.json({success:false,message:error.message})
    }
}

// API To get user data
const getData = async (req,resp) => {
    try {
        const user = req.user
        return resp.json({success:true,user:user})
    } catch (error) {
        return resp.json({success:false,message:error.message})        
    }
}

// API to get published Image 
const getPublishedImage = async (req,resp) => {
    try {
        const publishedImagesMessages = await chatModel.aggregate([
            {$unwind:"$messages"},
            {
                $match:{
                    "messages.isImage":true,
                    "messages.isPublished":true
                }
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    userName:"$userName"
                }
            },
        ])
        resp.json({success:true,images:publishedImagesMessages.reverse()})
    } catch (error) {
        resp.json({success:false,message:error.message})
    }
}

module.exports = { userRegister, userLogin, getData ,getPublishedImage };