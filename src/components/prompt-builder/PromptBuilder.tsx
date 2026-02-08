"use client";

import { useState, useEffect } from "react";
import { usePromptContext } from "@/lib/prompt-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
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
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MaskPainter } from "./MaskPainter";
import { Slider } from "@/components/ui/Slider";

export function PromptBuilder() {
  const { state, updateState } = usePromptContext();
  const { user, isLoading, isConfigured } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [activeTab, setActiveTab] = useState("subject");

  // Reset to appropriate default tab when mode changes
  useEffect(() => {
    if (state.mode === "generate") {
      setActiveTab("subject");
    } else {
      setActiveTab("image");
    }
  }, [state.mode]);

  // Get mode-specific info
  const getModeInfo = () => {
    switch (state.mode) {
      case "generate":
        return {
          title: "Create New Image",
          description: "Describe what you want to create and let AI generate it",
        };
      case "remix":
        return {
          title: "Remix Image",
          description: "Transform an existing image with your prompt",
        };
      case "edit":
        return {
          title: "Edit Image",
          description: "Paint over areas you want to change, then describe the changes",
        };
      case "upscale":
        return {
          title: "Upscale Image",
          description: "Enhance the resolution of your image",
        };
      case "describe":
        return {
          title: "Describe Image",
          description: "Get an AI-generated prompt from an existing image",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const modeInfo = getModeInfo();

  // Render content based on mode
  const renderContent = () => {
    if (state.mode === "generate") {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="subject">
                <span className="flex items-center gap-2">
                  Subject
                  {!state.subject && <span className="text-red-500 text-xs">required</span>}
                </span>
              </TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="text">Text in Image</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="reference">References</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="subject">
              <SubjectSection />
            </TabsContent>
            <TabsContent value="style">
              <StyleSection />
            </TabsContent>
            <TabsContent value="text">
              <TextSection />
            </TabsContent>
            <TabsContent value="settings">
              <TechnicalSection />
            </TabsContent>
            <TabsContent value="reference">
              <ReferenceSection />
            </TabsContent>
          </CardContent>
        </Tabs>
      );
    }

    if (state.mode === "remix") {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="image">
                <span className="flex items-center gap-2">
                  1. Image
                  {!state.sourceImage && <span className="text-red-500 text-xs">required</span>}
                </span>
              </TabsTrigger>
              <TabsTrigger value="prompt">
                <span className="flex items-center gap-2">
                  2. Prompt
                  {!state.subject && <span className="text-red-500 text-xs">required</span>}
                </span>
              </TabsTrigger>
              <TabsTrigger value="style">3. Style</TabsTrigger>
              <TabsTrigger value="settings">4. Settings</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="image">
              <div className="space-y-6">
                <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
                  <h3 className="font-medium text-[#2589bd] mb-1">Step 1: Upload Your Image</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Upload the image you want to remix. The AI will transform it based on your prompt.
                  </p>
                </div>
                <ImageUpload
                  label="Image to Remix"
                  description="Upload the image you want to transform"
                  value={state.sourceImage}
                  onChange={(value) => updateState("sourceImage", value)}
                />
                {state.sourceImage && (
                  <>
                    <Slider
                      label="Image Influence"
                      value={state.imageWeight}
                      min={0}
                      max={100}
                      step={5}
                      onChange={(value) => updateState("imageWeight", value)}
                      valueSuffix="%"
                    />
                    <div className="p-3 bg-[#998748]/10 rounded-lg border border-[#998748]/30">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Image uploaded! Now go to <button onClick={() => setActiveTab("prompt")} className="font-semibold text-[#998748] hover:underline">Step 2: Prompt</button> to describe how you want it transformed.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="prompt">
              <div className="space-y-4">
                <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
                  <h3 className="font-medium text-[#2589bd] mb-1">Step 2: Describe the Transformation</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Describe how you want the image to be transformed.
                  </p>
                </div>
                <SubjectSection />
              </div>
            </TabsContent>
            <TabsContent value="style">
              <StyleSection />
            </TabsContent>
            <TabsContent value="settings">
              <TechnicalSection />
            </TabsContent>
          </CardContent>
        </Tabs>
      );
    }

    if (state.mode === "edit") {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="image">
                <span className="flex items-center gap-2">
                  1. Paint Mask
                  {(!state.sourceImage || !state.maskImage) && <span className="text-red-500 text-xs">required</span>}
                </span>
              </TabsTrigger>
              <TabsTrigger value="prompt">
                <span className="flex items-center gap-2">
                  2. Edit Prompt
                  {!state.subject && <span className="text-red-500 text-xs">required</span>}
                </span>
              </TabsTrigger>
              <TabsTrigger value="settings">3. Settings</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="image">
              <div className="space-y-6">
                <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
                  <h3 className="font-medium text-[#2589bd] mb-1">Step 1: Upload & Paint Areas to Edit</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Upload your image, then paint over the areas you want to change. The painted areas (shown in red) will be regenerated.
                  </p>
                </div>

                {!state.sourceImage ? (
                  <ImageUpload
                    label="Image to Edit"
                    description="Upload the image you want to edit"
                    value={state.sourceImage}
                    onChange={(value) => updateState("sourceImage", value)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Paint Areas to Edit</h4>
                      <button
                        onClick={() => {
                          updateState("sourceImage", null);
                          updateState("maskImage", null);
                        }}
                        className="text-sm text-[#2589bd] hover:underline"
                      >
                        Change Image
                      </button>
                    </div>
                    <MaskPainter
                      sourceImage={state.sourceImage}
                      onMaskChange={(mask) => updateState("maskImage", mask)}
                    />
                  </div>
                )}

                {state.sourceImage && state.maskImage && (
                  <div className="p-3 bg-[#998748]/10 rounded-lg border border-[#998748]/30">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Mask created! Now go to <button onClick={() => setActiveTab("prompt")} className="font-semibold text-[#998748] hover:underline">Step 2: Edit Prompt</button> to describe what should appear in the painted areas.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="prompt">
              <div className="space-y-4">
                <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
                  <h3 className="font-medium text-[#2589bd] mb-1">Step 2: Describe What to Generate</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Describe what should appear in the painted areas of your image.
                  </p>
                </div>
                <SubjectSection />
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <TechnicalSection />
            </TabsContent>
          </CardContent>
        </Tabs>
      );
    }

    if (state.mode === "upscale") {
      return (
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
              <h3 className="font-medium text-[#2589bd] mb-1">Upload Image to Upscale</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload a low-resolution image and we'll enhance it to higher resolution.
              </p>
            </div>
            <ImageUpload
              label="Image to Upscale"
              description="Upload the image you want to enhance"
              value={state.sourceImage}
              onChange={(value) => updateState("sourceImage", value)}
            />
            {state.sourceImage && (
              <div className="p-3 bg-[#998748]/10 rounded-lg border border-[#998748]/30">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Image ready! Click <strong>Upscale Image</strong> in the panel to the right to enhance the resolution.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      );
    }

    if (state.mode === "describe") {
      return (
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-4 bg-[#2589bd]/10 dark:bg-[#2589bd]/20 rounded-lg border border-[#2589bd]/30">
              <h3 className="font-medium text-[#2589bd] mb-1">Upload Image to Describe</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload an image and we'll generate a detailed prompt that describes it. Great for learning how to write better prompts!
              </p>
            </div>
            <ImageUpload
              label="Image to Describe"
              description="Upload the image you want described"
              value={state.sourceImage}
              onChange={(value) => updateState("sourceImage", value)}
            />
            {state.sourceImage && (
              <div className="p-3 bg-[#998748]/10 rounded-lg border border-[#998748]/30">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Image ready! Click <strong>Describe Image</strong> in the panel to the right to get an AI-generated prompt.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      );
    }

    return null;
  };

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
                <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-[#f4f4f4]">iddy</h1>
                <p className="text-xs text-[#6b6b6b] dark:text-[#9a9a9a]">AI Prompt Builder for Ideogram</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowCollections(true)} className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors" title="Collections">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button onClick={() => setShowHistory(true)} className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors" title="History">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#998748] hover:bg-[#998748]/10 rounded-lg transition-colors" title="Settings">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
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

      {/* Mode Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <h2 className="text-lg font-semibold text-[#1A1A1A] dark:text-[#f4f4f4]">{modeInfo.title}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{modeInfo.description}</p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Builder */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated">
              {renderContent()}
            </Card>

            {/* Prompt Preview - only for modes that use prompts */}
            {(state.mode === "generate" || state.mode === "remix" || state.mode === "edit") && (
              <PromptPreview />
            )}
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
