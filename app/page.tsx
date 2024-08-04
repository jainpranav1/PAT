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

      const gemini_response = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          userText: transcript,
        }),
      }).then((r) => r.json());

      setAIText(gemini_response.AIText);

      const openai_response = await fetch("/api/googleCloud", {
        method: "POST",
        body: JSON.stringify({
          AIText: gemini_response.AIText,
        }),
      }).then((r) => r.json());
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
