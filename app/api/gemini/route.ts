import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs/promises";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

export async function POST(request: Request) {
  const { userText } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const data = await fs.readFile("app/api/gemini/conversation.json", {
    encoding: "utf8",
  });

  const chat = model.startChat({
    history: JSON.parse(data),
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const result = await chat.sendMessage(userText);
  const response = await result.response;
  const AIText = response.text();

  const history = await chat.getHistory();

  await fs.writeFile(
    "app/api/gemini/conversation.json",
    JSON.stringify(history)
  );

  return NextResponse.json({ AIText: AIText });
}
