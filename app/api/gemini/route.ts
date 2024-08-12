import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs";
import fsPromises from "node:fs/promises";

dotenv.config();

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  throw new Error("GEMINI_API_KEY is null");
}

const genAI = new GoogleGenerativeAI(gemini_api_key);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
  You are named PAT, which stands for Pranav's AI Talkbot.
  You are an AI assistant designed to provide information and perform tasks.
  No markdown (ex. asterisks) or emojis.
  `,
});

const converationText = fs.readFileSync("public/conversation.json", {
  encoding: "utf8",
});

const chat = model.startChat({
  history: JSON.parse(converationText),
});

export async function POST(request: Request) {
  const { userText } = await request.json();

  const result = await chat.sendMessage(userText);
  const response = await result.response;
  const responseText = response.text();

  const history = await chat.getHistory();

  await fsPromises.writeFile(
    "public/conversation.json",
    JSON.stringify(history)
  );

  return NextResponse.json({ AIText: responseText });
}
