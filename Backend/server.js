const dotenv = require('dotenv');
dotenv.config();
const express = require("express")
const cors = require("cors")
const app = express()
const connectDB = require("./configs/db");
const router = require("./routes/userRoute");
const chatRoute = require("./routes/chatRouter")
const msgRoutes = require("./routes/messageRoutes")
const creditRoute = require("./routes/creditsHours");
const stripeWebhook = require('./controllers/webhook');

// Port Connection 
const PORT = process.env.PORT || 3000

// Built-In Middleware
app.use(express.json())

// Connectivity
app.use(cors())

app.get("/",(req,resp)=>{
    resp.send("Backend Server is Live")
})

// Stripe WebHooks
app.post("/api/stripe",express.raw({type:"application/json"}),stripeWebhook)

// Routes
app.use("/api/user",router)
app.use("/api/chat",chatRoute)
app.use("/api/msg",msgRoutes)
app.use("/api/credit",creditRoute)

// db connection
// const dbConnect = async () => {
//     await connectDB();
//     app.listen(PORT,()=>{
//         console.log(`Backend Server Running on PORT ${PORT}`)
//     })
// }
// dbConnect();

connectDB();
module.exports = app;


// You’re using CommonJS syntax (require)
// but also using top-level await,
// which is only allowed in ES Modules (ESM).
// Node.js confuse ho jata hai ke code CommonJS hai ya ESM — isliye ye error throw karta hai:
// Cannot determine intended module format because both require() and top-level await are present.