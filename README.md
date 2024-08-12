# PAT

PAT (Pranav's AI Talkbot) is a JARVIS-like AI assistant. He appears as an undulating, floating orb using the Pepper's ghost illusion. Once he is tapped on, he stops undulating, indicating he is listening for a prompt from the user. After listening to the prompt, PAT delivers an audible reply. The orb expands with the frequency of the reply's audio. If the prompt was a command to open a certain website (ex. open google), PAT will open the website on the user's computer. PAT can be interrupted by tapping on him. PAT also stores the conversations in a local JSON file, allowing him to remember conversations across days. The app is colorblind friendly and free to use.

# Demo

[![PAT Video](https://img.youtube.com/vi/_JdgnBJxhuc/0.jpg)](https://www.youtube.com/watch?v=_JdgnBJxhuc)

# How Does It Work?

PAT is a Next.js project. PAT's floating orb was created using Three.js. PAT listens for a prompt from the user using the [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) interface of the Web Speech API. PAT processes prompts using the [Gemini API](https://ai.google.dev/gemini-api). PAT then delivers audible replies using [Google Cloud Text to Speech](https://cloud.google.com/text-to-speech?hl=en).

# How To Run

- Set up [Application Default Credentials](https://cloud.google.com/text-to-speech/docs/libraries#authentication) to use Google Cloud Text to Speech
- Get a [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)
- Clone this repo (`git clone https://github.com/jainpranav1/PAT.git`)
- Run `npm install` to install Node.js dependencies
- Run `npm start dev` in a terminal with administrator privileges to run the Next.js application
- Get your computer's ip address (the ip address has the following form: 192.168.x.x) using `ifconfig` (on mac) or `ipconfig` (on windows)
- On a phone, visit `https://<ip address>:3000`
- You should see a spherical orb - this is PAT
- Build a [Pepper's ghost viewer](https://www.youtube.com/watch?v=IIaZr31pptY)
- Place the phone in the viewer
- Tap PAT
- When he stops undulating, talk with him!
- Wait for a reply from PAT
- The conversation is saved in `public/conversation.json`

# Resources Used

I could not have built this project without extensive guidance from the following resources. Thank you to all the developers that made the resources.

- Tutorial for using Web Speech API - [Speech Recognition & Voice Synthesis in React (Web Speech API)
  ](https://www.youtube.com/watch?v=JFfCDvKiJqU)
- Tutorial for Three.js audio visualizer - [How To Create A 3D Audio Visualizer Using Three.js
  ](https://www.youtube.com/watch?v=qDIF2z_VtHs)

# Special Thanks

- Thank you to my Mom for helping me film the video. Thank you to my Mom and Dad for supporting me while making this project.
