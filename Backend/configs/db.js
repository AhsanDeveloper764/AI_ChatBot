const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        mongoose.connection.on("connected",()=>{
            console.log("Database Connected");            
        })
        await mongoose.connect(`${process.env.MONGODB_URL}/ChatBot`)
    } catch (error) {
        console.error("Error",error.message);
    }    
}

module.exports = connectDB
