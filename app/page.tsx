"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [userText, setUserText] = useState<string>();
  const [AIText, setAIText] = useState<string>();
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>();

  const activeVoice =
    voices?.find(({ name, lang }) => {
      if (name === "Google UK English Male") {
        return true;
      } else return false;
    }) || voices?.[0];

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    if (Array.isArray(voices) && voices.length > 0) {
      setVoices(voices);
      return;
    }

    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = function () {
        const voices = window.speechSynthesis.getVoices();
        setVoices(voices);
      };
    }
  }, []);

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

      if (!activeVoice) {
        return;
      }

      let utterance = new SpeechSynthesisUtterance(response.AIText);
      utterance.voice = activeVoice;

      window.speechSynthesis.speak(utterance);
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
