import type { Metadata } from "next";
import { PromptProvider } from "@/lib/prompt-context";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "iddy | AI Image Prompt Builder for Ideogram",
  description:
    "Create perfect prompts for Ideogram AI image generation. Powered by Claude for intelligent prompt optimization. Save your prompts, rate results, and build collections.",
  keywords: [
    "iddy",
    "Ideogram",
    "AI",
    "prompt builder",
    "image generation",
    "Claude",
    "prompt engineering",
    "AI art",
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
        <AuthProvider>
          <PromptProvider>{children}</PromptProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
