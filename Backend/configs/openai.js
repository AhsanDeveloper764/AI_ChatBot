const {OpenAI} = require("openai")

const openai = new OpenAI({
    apikey:process.env.OPENAI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

module.exports = openai

// const response = await openai.chat.completion.create({
//     model:"gemini-2.0-flash",
//     message:[
//         {
//             role: "system", 
//             content: "You are a helpful assistant."
//         },
//         {
//             role: "user",
//             content: "Explain to me how AI works",
//         },
//     ]
// })

// console.log(response.choices[0].message);

// npm install @google/generative-ai
