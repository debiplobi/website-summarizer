"use client";
import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { useComputedColorScheme } from "@mantine/core";

type Props = {
  text: string;
  speed?: number; // ms per character
};

export default function TypingMarkdown({ text, speed = 20 }: Props) {
  const colorScheme = useComputedColorScheme("light");
  const isDark = colorScheme === "dark";

  // Markdown component overrides for markdown-to-jsx
  const markdownOptions = {
    overrides: {
      h1: {
        props: {
          style: {
            fontSize: "1.8em",
            margin: "0.5em 0",
            color: isDark ? "#ffffff" : "#1a1a1a",
          },
        },
      },
      h2: {
        props: {
          style: {
            fontSize: "1.5em",
            margin: "0.5em 0",
            color: isDark ? "#ffffff" : "#1a1a1a",
          },
        },
      },
      h3: {
        props: {
          style: {
            fontSize: "1.2em",
            margin: "0.5em 0",
            color: isDark ? "#ffffff" : "#1a1a1a",
          },
        },
      },
      code: {
        component: ({ className, children, ...props }: any) => {
          const isCodeBlock = className?.startsWith("lang-");

          if (isCodeBlock) {
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
          }

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
        },
      },
      pre: {
        props: {
          style: {
            background: "#2d2d2d",
            color: "#f8f8f2",
            borderRadius: "5px",
            margin: "15px 0",
            padding: "0",
            overflow: "auto",
          },
        },
      },
      ul: {
        props: {
          style: {
            margin: "10px 0",
            paddingLeft: "25px",
            color: isDark ? "#f5f5f5" : "#1a1a1a",
          },
        },
      },
      ol: {
        props: {
          style: {
            margin: "10px 0",
            paddingLeft: "25px",
            color: isDark ? "#f5f5f5" : "#1a1a1a",
          },
        },
      },
      li: {
        props: {
          style: {
            margin: "5px 0",
            color: isDark ? "#f5f5f5" : "#1a1a1a",
            lineHeight: 1.6,
          },
        },
      },
      a: {
        props: {
          style: {
            color: isDark ? "#4dabf7" : "#3498db",
            textDecoration: "underline",
            textDecorationColor: isDark ? "#4dabf7" : "#3498db",
          },
          target: "_blank",
          rel: "noopener noreferrer",
        },
      },
      strong: {
        props: {
          style: {
            fontWeight: "bold",
            color: isDark ? "#ffffff" : "#1a1a1a",
          },
        },
      },
      em: {
        props: {
          style: {
            fontStyle: "italic",
            color: isDark ? "#f5f5f5" : "#1a1a1a",
          },
        },
      },
      p: {
        props: {
          style: {
            margin: "10px 0",
            color: isDark ? "#f5f5f5" : "#1a1a1a",
            lineHeight: 1.6,
          },
        },
      },
      blockquote: {
        props: {
          style: {
            borderLeft: `4px solid ${isDark ? "#4dabf7" : "#3498db"}`,
            paddingLeft: "15px",
            margin: "15px 0",
            color: isDark ? "#cccccc" : "#666666",
            fontStyle: "italic",
          },
        },
      },
    },
  };

  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;

    let i = 0;
    setDisplayed("");

    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <Markdown options={markdownOptions}>{displayed}</Markdown>;
}
