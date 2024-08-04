"use client";

import { useState } from "react";

export default function Home() {
  const [userText, setUserText] = useState<string>();
  const [AIText, setAIText] = useState<string>();

  function handleOnRecord() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      const response = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          userText: transcript,
        }),
      }).then((r) => r.json());
      setAIText(response.AIText);
    };

    recognition.start();
  }

  return (
    <div>
      <button onClick={handleOnRecord}>Start</button>
      <p>User Text: {userText}</p>
      <p>AI Text: {AIText}</p>
    </div>
  );
}
