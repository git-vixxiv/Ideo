import type { Metadata } from "next";
import { PromptProvider } from "@/lib/prompt-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ideogram Prompt Builder | Craft Perfect AI Image Prompts",
  description:
    "Create the perfect prompts for Ideogram AI image generation. Powered by Claude for intelligent prompt optimization.",
  keywords: [
    "Ideogram",
    "AI",
    "prompt",
    "image generation",
    "Claude",
    "prompt engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <PromptProvider>{children}</PromptProvider>
      </body>
    </html>
  );
}
