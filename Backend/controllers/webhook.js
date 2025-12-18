const Stripe = require("stripe");
const transactionModel = require("../models/Transaction");
const userModel = require("../models/user");

const stripeWebhook = async (req,resp) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK_KEY)
    } catch (error) {
        return resp.Status(400).json(`Webhook Error: ${error.message}`)
    } 

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.session.list({
                    payment_intent:paymentIntent.id,
                })
                const session = sessionList.data[0];
                const {transactionId,appId} = session.metadata;
                if(appId === "Devs_ChatBot"){
                    const transaction = await transactionModel.findOne({
                        _id:transactionId,
                        isPaid:false
                    })
                    // Update Credits in user Account
                    await userModel.updateOne({_id:transaction.id},{$inc:{credits:transaction.credits}})

                    // Update credit Payment status
                    transaction.isPaid = true;
                    await transaction.save()
                }else{
                    return resp.json({received:true,message:"Ignore event:Invalid App"})
                }
                break;
            }
            default:
                console.log("Unhandled event type:",event.type);
                break;
        }
        resp.json({received:true})
    } catch (error) {
        console.log("WebHook Processing Error",error.message);
        resp.status(500).json("Internal Server Error",error.message)
    }
}

module.exports = stripeWebhook