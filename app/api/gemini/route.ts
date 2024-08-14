import { NextResponse } from "next/server";
import dotenv from "dotenv";
import {
  GoogleGenerativeAI,
  FunctionDeclaration,
  FunctionDeclarationSchemaType,
  FunctionCall,
} from "@google/generative-ai";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import open from "open";
dotenv.config();

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  throw new Error("GEMINI_API_KEY is null");
}

const genAI = new GoogleGenerativeAI(gemini_api_key);

const openUrlDeclaration: FunctionDeclaration = {
  name: "openUrl",
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    description: "Opens a url in the default browser.",
    properties: {
      url: {
        type: FunctionDeclarationSchemaType.STRING,
        description:
          "A url. (Ex: https://www.google.com/, https://www.youtube.com/)",
      },
    },
    required: ["url"],
  },
};

const functions = {
  openUrl: async ({ url }: { url: string }) => {
    try {
      await open(url);
      return {
        result: `opened ${url}`,
      };
    } catch (error) {
      return {
        result: `failed to open ${url}`,
      };
    }
  },
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
  You are named PAT, which stands for Pranav's AI Talkbot.
  You are an AI assistant designed to provide information and perform tasks.
  Act like Jarvis from Iron Man.
  No emojis.
  `,
  tools: [
    {
      functionDeclarations: [openUrlDeclaration],
    },
  ],
});

const converation = fs.readFileSync("public/conversation.json", {
  encoding: "utf8",
});

const chat = model.startChat({
  history: JSON.parse(converation),
});

export async function POST(request: Request) {
  const { userText } = await request.json();

  const initialResult = await chat.sendMessage(userText);
  const initialResponse = initialResult.response;
  let responseText = initialResponse.text();
  const initialResponseFuncCalls = initialResponse.functionCalls();
  if (initialResponseFuncCalls) {
    if (initialResponseFuncCalls.length > 0) {
      const call = initialResponseFuncCalls[0];
      const callResult = await functions[call.name](call.args);
      const secondResult = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: callResult,
          },
        },
      ]);
      responseText = secondResult.response.text();
    } else {
      throw new Error("initialResponseFuncCalls is []");
    }
  }

  const history = await chat.getHistory();

  await fsPromises.writeFile(
    "public/conversation.json",
    JSON.stringify(history)
  );

  return NextResponse.json({ AIText: responseText });
}
