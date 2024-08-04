"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [userText, setUserText] = useState<string>();
  const [AIText, setAIText] = useState<string>();

  function handleOnStart() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);

      const geminiResponse = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          userText: transcript,
        }),
      }).then((r) => r.json());

      setAIText(geminiResponse.AIText);

      const googleCloudResponse = await fetch("/api/googleCloud", {
        method: "POST",
        body: JSON.stringify({
          AIText: geminiResponse.AIText,
        }),
      }).then((r) => r.json());

      // based off this stack overflow answer:
      // https://stackoverflow.com/questions/24151121/how-to-play-wav-audio-byte-array-via-javascript-html5
      const audioContext = new AudioContext();
      const bytesList = googleCloudResponse.audio.data;
      const bytesUint8Array = new Uint8Array(bytesList);
      const bytesArrayBuffer = bytesUint8Array.buffer;
      const decodedBuffer = await audioContext.decodeAudioData(
        bytesArrayBuffer
      );
      const source = audioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    };

    recognition.start();
  }

  return (
    <div>
      <button onClick={handleOnStart}>Start</button>
      <p>User Text: {userText}</p>
      <p>AI Text: {AIText}</p>
    </div>
  );
}
