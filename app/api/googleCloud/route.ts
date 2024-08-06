import { NextResponse } from "next/server";
import dotenv from "dotenv";
import textToSpeech from "@google-cloud/text-to-speech";
import fs from "node:fs/promises";
import * as protos from "@google-cloud/text-to-speech/build/protos/protos";

dotenv.config();

const client = new textToSpeech.TextToSpeechClient({
  projectId: "jarvisproject-431518",
});

export async function POST(request: Request) {
  const { AIText } = await request.json();

  // Construct the request
  const data: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text: AIText },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-GB", ssmlGender: "MALE" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(data);

  if (!response.audioContent) {
    throw new Error("response.audioContent is null");
  }

  return NextResponse.json({
    audio: response.audioContent,
  });
}
