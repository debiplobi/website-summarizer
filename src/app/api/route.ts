import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface ScrapeRequestBody {
  url: string;
}

interface OllamaResponse {
  response?: string;
}

async function summarize(text: string, url: string): Promise<string> {
  const response = await fetch(
    `${process.env.OLLAMA_API_ENDPOINT}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // model: "qwen2.5:1.5b",
        prompt: `I have scraped from ${url},so Summarize the following text concisely in markdown format with bullet points:\n\n${text}`,
        model: "llama3.2:3b",
        stream: false,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  const data: OllamaResponse = await response.json();
  return data.response?.trim() ?? "";
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
      // headers: {
      //   "User-Agent":
      //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      // },

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
    // console.log(textContent);

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
