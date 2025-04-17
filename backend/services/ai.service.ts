import { GoogleGenAI } from "@google/genai"; // Import the GoogleGenAI class from the @google/genai package
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY as string });

export async function main(prompt: string) {
  const fewExamples=`
  Here are a few examples of how you should respond:

Example 1:
Input: Build a simple Express server.
Output:
{
"text":"This is your filetree structure of express server",
"fileTree":{
"app.js":{
content: "
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000, () => console.log('Server is running on port 3000'));
"
},
"package.json":{
content: "
{
"name": "express-server",
"version": "1.0.0",
"description": "",
"main": "app.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [],
"author": "",
"license": "ISC",
"dependencies": {
"express": "^5.1.0"
}
}
",
"buildCommand": {
mainItem:"npm",
commands:["install"]
},

"startCommand": {
mainItem:"node",
commands:["app.js"]
}

}
}
}

Example 2:
Input: Hello.
Output: {
"text":"Hello! How can I help you today?"
}

Now respond to the following:
Input: ${prompt}
Output:
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: fewExamples,
    config:{
      responseMimeType:"application/json",
      systemInstruction: `You are an expert in MERN & Development. You have an experience of 10 years in the development. 
      You always write code in modular & break the code in the possible way and follow best practices. 
      You use understandable comments in the code, you create files as needed, 
      you write code while maintaining the working of previous code. You always follow the best practices of the development.
      You never miss edge cases and always write code that is scalable and maintainable. In your code, you always handle the errors & exceptions.
      `,
    }
  });
  return response.text;
}
