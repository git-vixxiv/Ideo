"use client";

import { useState } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { SubjectSection } from "./SubjectSection";
import { StyleSection } from "./StyleSection";
import { TechnicalSection } from "./TechnicalSection";
import { TextSection } from "./TextSection";
import { ReferenceSection } from "./ReferenceSection";
import { PromptPreview } from "./PromptPreview";
import { GenerationPanel } from "./GenerationPanel";
import { SettingsModal } from "./SettingsModal";
import { HistoryPanel } from "./HistoryPanel";
import { CollectionsPanel } from "./CollectionsPanel";
import { UserMenu } from "./UserMenu";

export function PromptBuilder() {
  const { state, updateState } = usePromptContext();
  const { user, isLoading, isConfigured } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-[#1A1A1A]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#f4f4f4]/90 dark:bg-[#1A1A1A]/90 border-b border-[#e0e0e0] dark:border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#998748] to-[#d1c69e] flex items-center justify-center shadow-lg shadow-[#998748]/20">
                <span className="text-[#1A1A1A] font-bold text-lg">id</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-[#f4f4f4]">
                  iddy
                </h1>
                <p className="text-xs text-[#6b6b6b] dark:text-[#9a9a9a]">
                  AI Prompt Builder for Ideogram
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Collections Button */}
              <button
                onClick={() => setShowCollections(true)}
                className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors"
                title="Collections"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </button>

              {/* History Button */}
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors"
                title="History"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors"
                title="Settings"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* User Menu / Sign In */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: "generate", name: "Generate", icon: "✨" },
            { id: "remix", name: "Remix", icon: "🔄" },
            { id: "edit", name: "Edit", icon: "✏️" },
            { id: "upscale", name: "Upscale", icon: "🔍" },
            { id: "describe", name: "Describe", icon: "📝" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateState("mode", mode.id as typeof state.mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                state.mode === mode.id
                  ? "bg-gradient-to-r from-[#998748] to-[#d1c69e] text-[#1A1A1A] shadow-lg shadow-[#998748]/25"
                  : "bg-white dark:bg-[#242424] text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#f0f0f0] dark:hover:bg-[#2e2e2e] border border-[#e0e0e0] dark:border-[#3a3a3a]"
              }`}
            >
              <span>{mode.icon}</span>
              <span className="font-medium">{mode.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated">
              <Tabs defaultValue="subject">
                <CardHeader className="pb-0">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="subject">Subject</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="technical">Settings</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="reference">Reference</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="subject">
                    <SubjectSection />
                  </TabsContent>
                  <TabsContent value="style">
                    <StyleSection />
                  </TabsContent>
                  <TabsContent value="technical">
                    <TechnicalSection />
                  </TabsContent>
                  <TabsContent value="text">
                    <TextSection />
                  </TabsContent>
                  <TabsContent value="reference">
                    <ReferenceSection />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Prompt Preview */}
            <PromptPreview />
          </div>

          {/* Right Panel - Generation */}
          <div className="lg:col-span-1">
            <GenerationPanel />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}
      {showCollections && <CollectionsPanel onClose={() => setShowCollections(false)} />}
    </div>
  );
}
