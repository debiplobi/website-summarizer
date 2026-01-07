import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Ollama } from "ollama";

interface ScrapeRequestBody {
  url: string;
}

const ollama = new Ollama({
  host: process.env.OLLAMA_API_ENDPOINT,
});

async function summarize(text: string, url: string): Promise<string> {
  try {
    const response = await ollama.generate({
      model: "llama3.2:3b",
      prompt: `You are a professional content summarizer. 

Website: ${url}

Content to summarize:
${text} 

Instructions:
- Create a concise summary in markdown format
- Use bullet points for key information
- Highlight the main topics and important details
- Keep it clear and well-organized
- If the content is too long, focus on the most important parts

Summary:`,
      stream: false,
      options: {
        temperature: 0.3, // Lower temperature for more focused summaries
        top_p: 0.9,
        num_predict: 500, // Limit response length
      },
    });

    return response.response.trim();
  } catch (error) {
    console.error("Ollama summarization error:", error);
    throw new Error(`Summarization failed: ${(error as Error).message}`);
  }
}

export async function POST(request: NextRequest) {
  let body: ScrapeRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const pageRes = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeout);

    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${pageRes.status}` },
        { status: 400 },
      );
    }

    const html = await pageRes.text();
    const $ = cheerio.load(html);

    // Remove non-text elements
    $(
      "script, style, nav, footer, header, iframe, noscript, svg, canvas",
    ).remove();

    let textContent =
      $("article").text() || $("main").text() || $("body").text();
    textContent = textContent.replace(/\s+/g, " ").trim();

    if (!textContent) {
      return NextResponse.json(
        { error: "No readable content found" },
        { status: 400 },
      );
    }

    const summary = await summarize(textContent, url);

    return NextResponse.json({ summary });
  } catch (err: unknown) {
    clearTimeout(timeout);

    if ((err as Error).name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 });
    }

    console.error("Scraping error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Scraping failed" },
      { status: 500 },
    );
  }
}
