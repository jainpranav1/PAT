import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

export async function POST(request: Request) {
  const { userText } = await request.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(userText);
  const response = await result.response;
  const AIText = response.text();

  console.log("AI Text", AIText);

  return NextResponse.json({ AIText: AIText });
}
