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

        {/* {error && ( */}
        {/*   <Alert */}
        {/*     icon={<IconAlertCircle size={16} />} */}
        {/*     color="red" */}
        {/*     variant="light" */}
        {/*   > */}
        {/*     {error} */}
        {/*   </Alert> */}
        {/* )} */}

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

        {/* {loading && ( */}
        {/*   <Center py="xl"> */}
        {/*     <Stack align="center" gap="md"> */}
        {/*       <Loader size="lg" /> */}
        {/*       <Text c="dimmed">Scraping and summarizing...</Text> */}
        {/*     </Stack> */}
        {/*   </Center> */}
        {/* )} */}

        {result && (
          <>
            {colorScheme == "dark" ? (
              <div
                style={{
                  marginTop: 20,
                  padding: "15px",
                  background: "var(--mantine-color-body)",
                  borderRadius: 4,
                  lineHeight: 1.6,
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                  border: "1px solid var(--mantine-color-default-border)",
                  color: "#f5f5f5", // Light text color
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        style={{
                          fontSize: "1.8em",
                          margin: "0.5em 0",
                          color: "#ffffff",
                        }}
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        style={{
                          fontSize: "1.5em",
                          margin: "0.5em 0",
                          color: "#ffffff",
                        }}
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        style={{
                          fontSize: "1.2em",
                          margin: "0.5em 0",
                          color: "#ffffff",
                        }}
                        {...props}
                      />
                    ),
                    code: ({
                      inline,
                      ...props
                    }: {
                      inline?: boolean;
                    } & React.HTMLAttributes<HTMLElement>) =>
                      inline ? (
                        <code
                          style={{
                            background: "#333333",
                            color: "#f8f8f2",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontFamily: "'Courier New', monospace",
                            fontSize: "0.9em",
                          }}
                          {...props}
                        />
                      ) : (
                        <code
                          style={{
                            background: "#2d2d2d",
                            color: "#f8f8f2",
                            padding: "12px",
                            borderRadius: "10px",
                            overflow: "auto",
                            fontFamily: "'Courier New', monospace",
                            display: "block",
                          }}
                          {...props}
                        />
                      ),
                    pre: ({ ...props }) => (
                      <pre
                        style={{
                          background: "#2d2d2d",
                          color: "#f8f8f2",
                          borderRadius: "5px",
                          margin: "10px 0",
                        }}
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        style={{
                          margin: "10px 0",
                          paddingLeft: "25px",
                          color: "#f5f5f5",
                        }}
                        {...props}
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        style={{
                          margin: "10px 0",
                          paddingLeft: "25px",
                          color: "#f5f5f5",
                        }}
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li
                        style={{ margin: "5px 0", color: "#f5f5f5" }}
                        {...props}
                      />
                    ),
                    a: ({ ...props }) => (
                      <a
                        style={{ color: "#4dabf7", textDecoration: "none" }} // Brighter link color
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong
                        style={{ fontWeight: "bold", color: "#ffffff" }}
                        {...props}
                      />
                    ),
                    em: ({ ...props }) => (
                      <em
                        style={{ fontStyle: "italic", color: "#f5f5f5" }}
                        {...props}
                      />
                    ),
                    p: ({ ...props }) => (
                      <p style={{ color: "#f5f5f5" }} {...props} />
                    ),
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 20,
                  padding: "15px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 4,
                  lineHeight: 1.6,
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        style={{ fontSize: "1.8em", margin: "0.5em 0" }}
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        style={{ fontSize: "1.5em", margin: "0.5em 0" }}
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        style={{ fontSize: "1.2em", margin: "0.5em 0" }}
                        {...props}
                      />
                    ),
                    code: ({
                      inline,
                      ...props
                    }: {
                      inline?: boolean;
                    } & React.HTMLAttributes<HTMLElement>) =>
                      inline ? (
                        <code
                          style={{
                            background: "#e8e8e8",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            fontFamily: "'Courier New', monospace",
                            fontSize: "0.9em",
                          }}
                          {...props}
                        />
                      ) : (
                        <code
                          style={{
                            background: "#2d2d2d",
                            color: "#f8f8f2",
                            padding: "12px",
                            borderRadius: "10px",
                            overflow: "auto",
                            fontFamily: "'Courier New', monospace",
                            display: "block",
                          }}
                          {...props}
                        />
                      ),
                    pre: ({ ...props }) => (
                      <pre
                        style={{
                          background: "#2d2d2d",
                          borderRadius: "5px",
                          margin: "10px 0",
                        }}
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        style={{ margin: "10px 0", paddingLeft: "25px" }}
                        {...props}
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        style={{ margin: "10px 0", paddingLeft: "25px" }}
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => (
                      <li style={{ margin: "5px 0" }} {...props} />
                    ),
                    a: ({ ...props }) => (
                      <a
                        style={{ color: "#3498db", textDecoration: "none" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    strong: ({ ...props }) => (
                      <strong style={{ fontWeight: "bold" }} {...props} />
                    ),
                    em: ({ ...props }) => (
                      <em style={{ fontStyle: "italic" }} {...props} />
                    ),
                  }}
                >
                  {result}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
