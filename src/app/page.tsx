"use client";

import { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Stack,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const colorScheme = useComputedColorScheme("light");

  const { toggleColorScheme } = useMantineColorScheme();

  const URL_REGEX =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  const scrape = async () => {
    setError("");
    setResult("");

    if (!URL_REGEX.test(url)) {
      setError("Please enter a valid URL!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, summarize: true }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.summary) {
        setResult(data.summary);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError(`Failed to connect to server.${err}`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Shared markdown component styles
  const getMarkdownComponents = (isDark: boolean) => ({
    h1: ({ ...props }) => (
      <h1
        style={{
          fontSize: "1.8em",
          margin: "0.5em 0",
          color: isDark ? "#ffffff" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        style={{
          fontSize: "1.5em",
          margin: "0.5em 0",
          color: isDark ? "#ffffff" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        style={{
          fontSize: "1.2em",
          margin: "0.5em 0",
          color: isDark ? "#ffffff" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    code: ({ 
      inline, 
      className, 
      children, 
      ...props 
    }: React.HTMLAttributes<HTMLElement> & { 
      inline?: boolean;
      className?: string;
    }) => {
      // Check if it's inline code or a code block
      const isInline = inline || !className;
      
      if (isInline) {
        return (
          <code
            style={{
              background: isDark ? "#333333" : "#e8e8e8",
              color: isDark ? "#f8f8f2" : "#1a1a1a",
              padding: "2px 6px",
              borderRadius: "3px",
              fontFamily: "'Courier New', Consolas, Monaco, monospace",
              fontSize: "0.9em",
            }}
            {...props}
          >
            {children}
          </code>
        );
      }

      // Code block
      return (
        <code
          style={{
            background: "#2d2d2d",
            color: "#f8f8f2",
            padding: "12px",
            borderRadius: "5px",
            overflow: "auto",
            fontFamily: "'Courier New', Consolas, Monaco, monospace",
            fontSize: "0.9em",
            display: "block",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        style={{
          background: "#2d2d2d",
          color: "#f8f8f2",
          borderRadius: "5px",
          margin: "15px 0",
          padding: "0",
          overflow: "auto",
        }}
        {...props}
      >
        {children}
      </pre>
    ),
    ul: ({ ...props }) => (
      <ul
        style={{
          margin: "10px 0",
          paddingLeft: "25px",
          color: isDark ? "#f5f5f5" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    ol: ({ ...props }) => (
      <ol
        style={{
          margin: "10px 0",
          paddingLeft: "25px",
          color: isDark ? "#f5f5f5" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    li: ({ ...props }) => (
      <li
        style={{
          margin: "5px 0",
          color: isDark ? "#f5f5f5" : "#1a1a1a",
          lineHeight: 1.6,
        }}
        {...props}
      />
    ),
    a: ({ ...props }) => (
      <a
        style={{
          color: isDark ? "#4dabf7" : "#3498db",
          textDecoration: "underline",
          textDecorationColor: isDark ? "#4dabf7" : "#3498db",
        }}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    strong: ({ ...props }) => (
      <strong
        style={{
          fontWeight: "bold",
          color: isDark ? "#ffffff" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    em: ({ ...props }) => (
      <em
        style={{
          fontStyle: "italic",
          color: isDark ? "#f5f5f5" : "#1a1a1a",
        }}
        {...props}
      />
    ),
    p: ({ ...props }) => (
      <p
        style={{
          margin: "10px 0",
          color: isDark ? "#f5f5f5" : "#1a1a1a",
          lineHeight: 1.6,
        }}
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        style={{
          borderLeft: `4px solid ${isDark ? "#4dabf7" : "#3498db"}`,
          paddingLeft: "15px",
          margin: "15px 0",
          color: isDark ? "#cccccc" : "#666666",
          fontStyle: "italic",
        }}
        {...props}
      />
    ),
  });

  return (
    <Container size="md" py="xl">
      <Stack
        gap="md"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title order={1} style={{ fontSize: "1.5rem" }}>
          Website Summarizer
        </Title>

        <ActionIcon
          variant="transparent"
          size="lg"
          onClick={toggleColorScheme}
          aria-label="Toggle theme"
        >
          {colorScheme === "dark" ? (
            <IconMoon size={18} />
          ) : (
            <IconSun size={18} />
          )}
        </ActionIcon>

        <TextInput
          placeholder="https://example.com"
          size="md"
          style={{ width: "100%" }}
          value={url}
          onChange={(e) => {
            setUrl(e.currentTarget.value);
            setError("");
          }}
          error={error}
        />

        <Button
          style={{
            display: "flex",
            justifyContent: "center",
            maxWidth: 300,
          }}
          onClick={scrape}
          disabled={loading || !url}
          loading={loading}
          loaderProps={{ type: "dots" }}
          size="md"
          fullWidth
        >
          Scrape & Summarize
        </Button>

        {result && (
          <div
            style={{
              marginTop: 20,
              padding: "20px",
              background:
                colorScheme === "dark"
                  ? "var(--mantine-color-body)"
                  : "#f5f5f5",
              borderRadius: 8,
              lineHeight: 1.6,
              fontSize: "clamp(14px, 2.5vw, 16px)",
              border:
                colorScheme === "dark"
                  ? "1px solid var(--mantine-color-default-border)"
                  : "1px solid #e0e0e0",
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
            }}
          >
            <ReactMarkdown components={getMarkdownComponents(colorScheme === "dark")}>
              {result}
            </ReactMarkdown>
          </div>
        )}
      </Stack>
    </Container>
  );
}
