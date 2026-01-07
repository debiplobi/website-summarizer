import type { Metadata } from "next";
import { Rubik, Saira } from "next/font/google";
import "./globals.css";

import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "./theme";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Summarizer",
  description: "summarize website using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${rubik.variable} ${saira.variable} antialiased`}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
