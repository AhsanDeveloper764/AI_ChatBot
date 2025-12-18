const axios = require("axios")
const chatModel = require("../models/chat")
const userModel = require("../models/user")
const imagekit = require("../configs/imagekit")
const openai = require("../configs/openai")

// Text-based AI chat Message Controller
const textMessageController = async (req,resp) => {
    try {
        const userId = req.user._id
        const {chatId,prompt} = req.body
        const chat = await chatModel.findOne({userId,_id:chatId})
        chat.message.push({role:"user",content:prompt,timestamp:Date.now(),isImage:false})
        const {choices} = await openai.chat.completions.create({
        model:"gemini-2.0-flash",
        messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ]
        })

        const reply = {...choices[0].message,timestamp:Date.now(),isImage:false}
        resp.json({success:true,reply:reply})
        chat.message.push(reply)
        await chat.save()
        await userModel.updateOne({_id:userId},{$inc:{credits:-1}})
    } catch (error) {
        resp.json({success:false,message:error.message})
    }
}
// API Controller Function generate Images to AI
const imageMessageController = async (req,resp) => {
    try {
        const userId = req.user._id
        // check credits
        if(req.user.credits < 1){
            return resp.json({success:false,message:"You Don't have enough credits to use this features"})
        }
        const { prompt,chatId,isPublished } = req.body
        const chat = await chatModel.findOne({userId,_id:chatId})

        // push user message
        chat.message.push({
            role:"user",
            content:prompt,
            timestamp:Date.now(),
            isImage:false
        })

        // Encode the Prompt
        const encodedPropmt = encodeURIComponent(prompt)

        // construct imagekit AI generation URL
        const generatedImageURL =`${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPropmt}/ChatBot/${Date.now()}.png?tr=w-800,h-800`;
        console.log("Generated URL:", generatedImageURL);


        // Trigger image Generation by fetching from ImageKit
        const aiImageResponce = await axios.get(generatedImageURL,{responseType:"arraybuffer"})

        // Convert to Base64
        const base64img = `data:image/png;base64,${Buffer.from(aiImageResponce.data,"binary").toString("base64")}`

        // Upload to ImageKit Media Library
        const uploadResponce = await imagekit.upload({
            file:base64img,
            fileName:`${Date.now()}.png`,
            folder:"Devs_ChatBot" // ye special character support nhi krta hay like ',"",$,&,*,@ 
        })
        const reply = {
            role:"assistant",
            content:uploadResponce.url,
            timestamp:Date.now(),
            isImage:true,
            isPublished
        }
        resp.json({success:true,reply:reply})
        chat.message.push(reply)
        await chat.save()
        await userModel.updateOne({_id:userId},{$inc:{credits:-2}})
    } catch (error) {
        resp.json({success:false,message:error.message})
    }
}

module.exports = {imageMessageController,textMessageController}