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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const data = await fs.readFile("public/conversation.json", {
    encoding: "utf8",
  });

  const chat = model.startChat({
    history: JSON.parse(data),
  });

  const result = await chat.sendMessage(userText);
  const response = await result.response;
  let AIText = response.text();

  // remove formatting from reponse
  AIText = AIText.split("*").join("");

  const history = await chat.getHistory();

  await fs.writeFile("public/conversation.json", JSON.stringify(history));

  return NextResponse.json({ AIText: AIText });
}
