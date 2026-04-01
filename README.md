# 🌍 AI SRT Subtitle Translator
- A truly universal, client-side `.srt` subtitle translator powered by modern LLM APIs. Upload any `.srt` file, type in any target or source language, securely provide your API Key (e.g., OpenAI, Ollama, OpenRouter), and let the application translate your subtitles line-by-line while perfectly preserving the critical timestamp metadata and syncing limits!
Currently deployed live on Vercel.
---
## 📸 Demo Video

https://github.com/user-attachments/assets/678729e2-6f44-41e6-9f6f-49d3126ad8a5

---
## 🚀 Features
- **Any Language Support:** You are not limited to predefined dropdowns. Type *any* source or target language (e.g., "Spanish to Japanese", "Thai to English"), and the LLM handles it dynamically.
- **Any LLM Provider:** Because the app allows a customized Base URL (e.g., OpenAI, Anthropic, Ollama, xAI), you can seamlessly swap out language models to optimize for cost or translation nuances.
- **100% Client-Side Privacy:** Your API Key is only sent from your browser straight to the LLM API provider. No backend servers ever read, store, or intercept your keys.
- **Smart SRT Parsing:** Automatically splits large SRT files into manageable batches, maintaining Exact ID constraints, merging prevention, and Character Per Second (CPS) tracking.
- **Zero-Config Deployment:** Easily integratable on any static hosting platform (like Vercel). No 10s Serverless timeout limits because everything runs in the browser!
## 💻 Technologies Used
- **Frontend Framework:** React 18, Vite
- **Styling:** Vanilla CSS & Inline Styling
- **Animations:** GSAP (GreenSock) for fluid UI/UX layouts
- **Deployment:** Vercel (Static Web)
- **Language & Utilities:** TypeScript, async browser `fetch()` API for seamless LLM calls
## 📝 The Process
The original version of this application used a full-stack approach with a FastAPI Python backend parsing the files and calling OpenAI. However, when migrating to Vercel, traditional Serverless Functions timed out at 10 seconds—far too short for processing dense, multi-batch SRT files. To solve this, the entire Python backbone was completely ported to **TypeScript**, allowing the local browser to execute the heavy parsing and batch AI requests smoothly, bypassing all standard server-side streaming limitations!
## 🧠 What I Learned
- **Client-Side Heavy Lifting:** Moving processor-intensive or long-running scripts (like batch API calls) entirely to the browser eliminates backend infrastructural limitations like strict timeout windows.
- **LLM Prompt Engineering:** Understanding how to strictly force LLMs to return identical metadata. Translating subtitles isn't just word manipulation—if the AI inadvertently merges two subtitles into one without preserving the exact `ID` mapping, the timings of the entire video fall out of sync.
- **Seamless Integrations:** How React `localStorage` combined with an initial modal logic flow creates excellent user experience without relying on traditional databases for configuration keys.
## 📈 Overall Growth
This project drastically shifted architecture paradigms for me, proving that static web applications do not always require massive backend ecosystems to accomplish high-grade algorithmic work. Developing with `fetch` alongside Vite significantly leveled up my understanding of building fast, distributable, and entirely self-contained cloud applications.
## 🔧 How It Can Be Improved
- **Downloadable Config Profiles:** Allow users to export or save multiple preset JSON configuration files for different "voices" or frequent language pairs.
- **Advanced Streaming UI:** Currently, the progress bar updates on a batch-by-batch basis. Adding `ReadableStream` logic would allow users to visually see each translated sentence load into the table in real-time.
- **CPS Editing UI:** A built-in editor block where users can immediately fix "High reading speed" warnings *before* finalizing their download.
