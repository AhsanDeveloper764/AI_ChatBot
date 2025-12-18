const jwt = require("jsonwebtoken")
const userModel = require("../models/user")

const protect = async (req,resp,next) => {
    let token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)  
        const UserId = decoded.id;
        const User = await userModel.findById(UserId)
        if(!userModel){
            return resp.status(500).json({success:false,message:"Not Authorized, user not found"})
        }
        req.user = User
        next()
    } catch (error) {
        resp.status(401).json({message:"Not Authorized,token failed"})
    }
}

module.exports = protect