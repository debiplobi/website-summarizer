# Website Summarizer

A website summarizer built with Next.js(React), leveraging local LLMs via Ollama to generate concise summaries of web content.

## Features

- **URL Summarization**: Input any URL to get a concise summary of its content.
- **Local AI**: Uses Ollama for privacy-focused, local inference.
- **Modern UI**: Built with Mantine for a clean and responsive interface.
- **Markdown Support**: Summaries are rendered with React Markdown for better readability.

## Tech Stack

- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **UI Library**: [Mantine](https://mantine.dev/)
- **Scraping**: Cheerio
- **AI/LLM**: Ollama (Local/Self-hosted)
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.com/) (running locally/self-hosted)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/debiplobi/website-summarizer
   cd website-summarizer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Environment Variables:**

   Copy the example environment file to create your local declaration:

   ```bash
   cp example.env .env
   ```

   Edit `.env` if your Ollama instance is running on a different port or server (default is `http://localhost:11434`).

   ```env
   OLLAMA_API_ENDPOINT=http://localhost:11434
   ```

4. **Pull an Ollama Model:**

   Make sure you have a model pulled in Ollama (e.g., `llama3.2:3b` or `mistral`).

   ```bash
   ollama pull llama3.2:3b
   ```

## Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open the application:**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

3. **Usage:**
   - Enter a URL in the input field.
   - Click "Summarize".
   - View the generated summary.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build

npm run start
# or
yarn start
```
