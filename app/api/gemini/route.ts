import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs/promises";

dotenv.config();

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  throw new Error("can't access the GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(gemini_api_key);

export async function POST(request: Request) {
  const { userText } = await request.json();

  const stateText = await fs.readFile("public/state.json", {
    encoding: "utf8",
  });

  let stateJson = JSON.parse(stateText);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: `
    You are named Hammock, which stands for the Holographic MCU Chatbot.
    You are similar to Jarvis from the MCU.
    You ask 10 trivia questions about the MCU.
    Only ask true/false questions.
    Make the questions challenging.
    Award 1 point for a correct answer.
    Don't include emojis in your response.
    Don't include markdown in your response (such as asterisks (*)).
    The number of questions answered so far is ${stateJson.numOfQuestionsAnswered}.
    The current score is ${stateJson.score}.
    Initially, introduce yourself to the user and details about the game.
    Mention in your introduction that you are similar to Jarvis.
    Don't mention the number of questions answered so far or the current score
    in the introduction.
    Your responses should have the following JSON schema:
    
    { 
      "hammockMessage": "string",
      "questionAnswered": "boolean",
      "awardPoint": "boolean"
    }
    `,
  });

  const converationText = await fs.readFile("public/conversation.json", {
    encoding: "utf8",
  });

  const chat = model.startChat({
    history: JSON.parse(converationText),
  });

  const result = await chat.sendMessage(userText);
  const response = await result.response;
  const responseText = response.text();
  const responseJson = JSON.parse(responseText);

  const history = await chat.getHistory();

  await fs.writeFile("public/conversation.json", JSON.stringify(history));

  if (responseJson.questionAnswered) {
    stateJson.numOfQuestionsAnswered += 1;
  }

  if (responseJson.awardPoint) {
    stateJson.score += 1;
  }

  await fs.writeFile("public/state.json", JSON.stringify(stateJson));

  return NextResponse.json({ AIText: responseJson.hammockMessage });
}
