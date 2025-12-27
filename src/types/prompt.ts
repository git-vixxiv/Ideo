// Prompt Builder Types

import type {
  AspectRatio,
  StyleType,
  RenderingSpeed,
  ColorPalettePreset,
  GenerationMode,
} from "./ideogram";

export interface SubjectCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subCategories?: string[];
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  example?: string;
}

export interface MoodOption {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface LightingOption {
  id: string;
  name: string;
  keywords: string[];
}

export interface CompositionOption {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface PromptBuilderState {
  // Generation Mode
  mode: GenerationMode;

  // Core Content
  subject: string;
  subjectCategory: string;
  action: string;
  setting: string;

  // Style & Aesthetic
  styleType: StyleType;
  artStyle: string;
  mood: string;
  lighting: string;
  colorScheme: string;

  // Technical Settings
  aspectRatio: AspectRatio;
  renderingSpeed: RenderingSpeed;
  colorPalette: ColorPalettePreset | "CUSTOM" | null;
  customColors: string[];
  magicPrompt: "ON" | "OFF" | "AUTO";
  seed: number | null;
  numImages: number;

  // Text in Image
  textContent: string;
  textPlacement: string;
  textStyle: string;

  // Composition
  composition: string;
  perspective: string;
  background: string;

  // Negative Prompt
  negativePrompt: string;

  // Reference Images
  styleReferenceImage: string | null;
  characterReferenceImage: string | null;
  sourceImage: string | null; // For remix/edit modes
  maskImage: string | null; // For edit mode
  imageWeight: number; // For remix mode (0-100)

  // Additional Details
  additionalDetails: string;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  state: PromptBuilderState;
  generatedPrompt: string;
  optimizedPrompt?: string;
  generatedImages?: string[];
  isFavorite: boolean;
}

export interface ClaudeOptimizationRequest {
  currentPrompt: string;
  state: PromptBuilderState;
  feedback?: string;
}

export interface ClaudeOptimizationResponse {
  optimizedPrompt: string;
  negativePrompt: string;
  explanation: string;
  suggestions: string[];
}
