const express = require("express")
const { getPlans, purchasePlans } = require("../controllers/creditController")
const protect = require("../middlewares/auth")
const creditRouter = express.Router()

creditRouter.get("/plan",getPlans)
creditRouter.post("/purchase",protect,purchasePlans)

module.exports = creditRouter