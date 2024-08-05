"use client";

import * as THREE from "three";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [userText, setUserText] = useState<string>();
  const [AIText, setAIText] = useState<string>();

  function start() {
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

  // based off of this code:
  // https://dev.to/omher/how-to-start-using-react-and-threejs-in-a-few-minutes-2h6g
  const refContainer = useRef(null);
  useEffect(() => {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    refContainer.current &&
      refContainer.current.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div>
      <button onClick={start}>Start</button>
      <p>User Text: {userText}</p>
      <p>AI Text: {AIText}</p>
      <div ref={refContainer}></div>
    </div>
  );
}
