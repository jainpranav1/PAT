"use client";

import * as THREE from "three";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  let analyser: null | AnalyserNode = null;

  function start() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);

      const geminiResponse = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({
          userText: transcript,
        }),
      }).then((r) => r.json());

      console.log(geminiResponse.AIText);

      const googleCloudResponse = await fetch("/api/googleCloud", {
        method: "POST",
        body: JSON.stringify({
          AIText: geminiResponse.AIText,
        }),
      }).then((r) => r.json());

      // based off this stack overflow answer:
      // https://stackoverflow.com/questions/24151121/how-to-play-wav-audio-byte-array-via-javascript-html5

      const audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const bytesList = googleCloudResponse.audio.data;
      const bytesUint8Array = new Uint8Array(bytesList);
      const bytesArrayBuffer = bytesUint8Array.buffer;
      const decodedBuffer = await audioContext.decodeAudioData(
        bytesArrayBuffer
      );

      const source = audioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start(0);

      source.onended = async function (event) {
        analyser = null;
      };
    };

    recognition.start();
  }

  const average = (array: Uint8Array) => {
    return (
      array.reduce((a, b) => {
        return a + b;
      }) / array.length
    );
  };

  // based off of this code:
  // https://dev.to/omher/how-to-start-using-react-and-threejs-in-a-few-minutes-2h6g
  const refContainer = useRef(null) as { current: null | HTMLElement };
  useEffect(() => {
    // === THREE.JS CODE START ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
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

    const uniforms = {
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_frequency: { type: "f", value: 0.0 },
      u_time: { type: "f", value: 0.0 },
    };

    const geometry = new THREE.IcosahedronGeometry(4, 20);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        uniform float u_time;

        vec3 mod289(vec3 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x)
        {
          return mod289(((x*34.0)+10.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        float pnoise(vec3 P, vec3 rep)
        {
          vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
          vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
          return 2.2 * n_xyz;
        }

        uniform float u_frequency;

        void main() {
          float noise = 5.0 * pnoise(position + u_time, vec3(10.0));
          float displacement = (u_frequency * 1.) + (noise / 10.0);
          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 u_resolution;

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution;

          gl_FragColor = vec4(vec3(st.x, st.y, 1.0), 1.0);
        }
      
      `,
    });
    var ball = new THREE.Mesh(geometry, material);
    ball.material.wireframe = true;

    scene.add(ball);
    camera.position.z = 8;

    const clock = new THREE.Clock();

    var animate = function () {
      uniforms.u_time.value = clock.getElapsedTime();
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        uniforms.u_frequency.value = average(dataArray) / 100.0;
      } else {
        uniforms.u_frequency.value = 0.0;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <button onClick={start}>Start</button>
      <div ref={refContainer}></div>
    </div>
  );
}
