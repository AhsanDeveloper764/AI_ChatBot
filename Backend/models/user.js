const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{ type:String,  required:true },
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true},
    credits:{ type:Number, default:20},
})

// hash Password Hashing
userSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        return next
    }
    const abc = await bcrypt.genSalt(10) // gensalt say hota yee hay kay ye round chlata hay hashing kay like agar hmnay 
    // gensalt(10) likha hay tw ye password hashing kay 10 round complete krega
    this.password = await bcrypt.hash(this.password,abc)
    next();
})


const userModel = mongoose.model("User",userSchema);
module.exports = userModel;