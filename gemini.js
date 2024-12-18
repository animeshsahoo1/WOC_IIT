import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();
const ask = "Write 170 random words, for a typing test with some random punctuations only random words which are not very long, and no repetition is allowed";

async function textGenTextOnlyPrompt(prompt) {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const result = await model.generateContent(prompt);//await keyword can only be used in async function
  console.log(result.response.text());
}
textGenTextOnlyPrompt(ask);

export { textGenTextOnlyPrompt };
