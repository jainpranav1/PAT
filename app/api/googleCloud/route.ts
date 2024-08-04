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
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(data);

  if (response.audioContent) {
    // Write the binary audio content to a local file
    await fs.writeFile(
      "app/api/googleCloud/output.mp3",
      response.audioContent,
      "binary"
    );
    console.log("Audio content written to file: output.mp3");
  }

  return NextResponse.json({});
}
