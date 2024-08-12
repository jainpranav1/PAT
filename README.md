# PAT

PAT (Pranav's AI Talkbot) is a JARVIS-like AI assistant. He appears as an undulating, floating orb using the Pepper's ghost illusion. Once he is tapped on, he stops undulating, indicating he is listening for a prompt from the user. After listening to the prompt, PAT delivers an audible reply. The orb expands with the frequency of the reply's audio. If the prompt was a command to open a certain website (ex. open google), PAT will open the website on the user's computer. PAT can be interrupted by tapping on him. PAT also stores the conversations in a local JSON file, allowing him to remember conversations across days. The app is colorblind friendly and free to use.

# Demo

[![PAT Video](https://img.youtube.com/vi/_JdgnBJxhuc/0.jpg)](https://www.youtube.com/watch?v=_JdgnBJxhuc)

# How Does It Work?

PAT is a Next.js project. PAT's floating orb was created using Three.js. PAT listens for a prompt from the user using the [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) interface of the Web Speech API. PAT processes prompts using the [Gemini API](https://ai.google.dev/gemini-api). PAT then delivers audible replies using [Google Cloud Text to Speech](https://cloud.google.com/text-to-speech?hl=en).

# How To Run

- Clone this repo (`git clone https://github.com/jainpranav1/PAT.git`)
-
- Download [Node.js](https://nodejs.org/en)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Resources

- [Speech Recognition Tutorial](https://www.youtube.com/watch?v=JFfCDvKiJqU)
