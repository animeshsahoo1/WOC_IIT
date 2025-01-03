import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();
const ask = "Write 170 random words, for a typing test only random words which are avg length of 6 characters, and no repetition is allowed, also add some punctuations here and there";

async function textGenTextOnlyPrompt(prompt) {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const result = await model.generateContent(prompt);//await keyword can only be used in async function
  console.log(result.response.text());
}
textGenTextOnlyPrompt(ask);

export { textGenTextOnlyPrompt };

// const hardWords = [
//   "Quick", "zephyr", "jumps;", "swiftly,", "brown", "fox.", "Azure", "dreams,", 
//   "fizzle,", "then", "pop!", "Quiet", "moments,", "yielding", "to", "noisy", "chaos.", 
//   "Purple", "grapes,", "juicy", "and", "sweet.", "Crimson", "sunset,", "painted", 
//   "across", "the", "sky.", "Gloomy", "weather,", "but", "hope", "remains.", 
//   "Silver", "spoon,", "elegant", "and", "refined.", "Yellow", "sun,", "bright", "and", 
//   "warm.", "Orange", "tiger,", "striped", "and", "fierce.", "Green", "leaves,", 
//   "dancing", "in", "the", "breeze.", "Blue", "ocean,", "vast", "and", "deep.", 
//   "Small", "bird,", "singing", "a", "sweet", "song.", "Giant", "tree,", "reaching", 
//   "for", "the", "sky.", "Tiny", "flower,", "blooming", "brightly.", "Clever", 
//   "cat,", "stealthy", "and", "agile.", "Happy", "dog,", "wagging", "its", "tail.", 
//   "Funny", "joke,", "making", "everyone", "laugh.", "Sad", "clown,", "hiding", 
//   "his", "grief.", "Angry", "bull,", "charging", "forward.", "Scared", "mouse,", 
//   "hiding", "in", "a", "hole.", "Brave", "knight,", "fighting", "for", "justice.", 
//   "Wise", "owl,", "perched", "on", "a", "branch.", "Silly", "goose,", "honking", 
//   "loudly.", "Old", "castle,", "standing", "proudly.", "New", "car,", "shiny", 
//   "and", "fast.", "Big", "house,", "comfortable", "and", "spacious.", "Little", 
//   "bug,", "crawling", "on", "the", "wall.", "Long", "road,", "stretching", 
//   "into", "the", "distance."
// ];

// // Function to jumble words using random sort and create a paragraph
// function generateJumbledParagraph(wordsArray, wordCount = 170) {
//   // Shuffle the array by sorting it randomly
//   const shuffled = wordsArray.slice().sort(() => Math.random() - 0.5);//randomly sort
//   // join to form a paragraph
//   return shuffled.slice(0, wordCount).join(' ');
// }

// let jumbledParagraph = generateJumbledParagraph(hardWords);
// console.log(jumbledParagraph);