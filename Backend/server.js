// const dotenv = require('dotenv');
// dotenv.config();
// const express = require("express")
// const cors = require("cors")
// const app = express()
// const connectDB = require("./configs/db");
// const router = require("./routes/userRoute");
// const chatRoute = require("./routes/chatRouter")
// const msgRoutes = require("./routes/messageRoutes")
// const creditRoute = require("./routes/creditsHours");
// const stripeWebhook = require('./controllers/webhook');

// // Port Connection 
// const PORT = process.env.PORT || 3000

// // Built-In Middleware
// app.use(express.json())

// // Connectivity
// app.use(cors())

// // Stripe WebHooks
// app.post("/api/stripe",express.raw({type:"application/json"}),stripeWebhook)

// // Routes
// app.use("/api/user",router)
// app.use("/api/chat",chatRoute)
// app.use("/api/msg",msgRoutes)
// app.use("/api/credit",creditRoute)

// // db connection
// const dbConnect = async () => {
//     await connectDB();
//     app.listen(PORT,()=>{
//         console.log(`Backend Server Running on PORT ${PORT}`)
//     })
// }
// dbConnect();

// You’re using CommonJS syntax (require)
// but also using top-level await,
// which is only allowed in ES Modules (ESM).
// Node.js confuse ho jata hai ke code CommonJS hai ya ESM — isliye ye error throw karta hai:
// Cannot determine intended module format because both require() and top-level await are present.


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./configs/db");
const router = require("./routes/userRoute");
const chatRoute = require("./routes/chatRouter");
const msgRoutes = require("./routes/messageRoutes");
const creditRoute = require("./routes/creditsHours");
const stripeWebhook = require('./controllers/webhook');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend API is live");
});

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use("/api/user", router);
app.use("/api/chat", chatRoute);
app.use("/api/msg", msgRoutes);
app.use("/api/credit", creditRoute);

// Export serverless function
module.exports = async (req, res) => {
  try {
    // Connect DB only once (Vercel caches)
    if (!global.dbConnected) {
      await connectDB();
      global.dbConnected = true;
    }
    // Pass the request to Express
    app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
