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
import TypingMarkdown from "./components/TypingMarkdown";

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
        <Title order={1} style={{ fontSize: "2rem" }}>
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
              minHeight: "100vh",
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
            <TypingMarkdown text={result} />
          </div>
        )}
      </Stack>
    </Container>
  );
}
