import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs/promises";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { AIText } = await request.json();

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: AIText,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  console.log(buffer);

  return NextResponse.json({});
}
