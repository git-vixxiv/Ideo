// Prompt Builder Utilities

import type { PromptBuilderState } from "@/types/prompt";
import {
  ART_STYLES,
  ANIMATION_STYLES,
  MOODS,
  LIGHTING_OPTIONS,
  COMPOSITIONS,
  TEXT_PLACEMENTS,
  TEXT_STYLES,
  BACKGROUNDS,
} from "./constants";

/**
 * Build a prompt from the current state
 * Following Ideogram best practices:
 * 1. Lead with the most important element (subject)
 * 2. One subject, one primary style
 * 3. Use quotation marks for text
 * 4. Specify aspect ratio context
 * 5. Pin text placement explicitly
 * 6. Specify background
 * 7. Use mood/emotion cues
 */
export function buildPrompt(state: PromptBuilderState): string {
  const parts: string[] = [];

  // 1. Subject and Action (most important, comes first)
  if (state.subject) {
    let subjectPart = state.subject;
    if (state.action) {
      subjectPart += `, ${state.action}`;
    }
    parts.push(subjectPart);
  }

  // 2. Setting/Environment
  if (state.setting) {
    parts.push(`in ${state.setting}`);
  }

  // 3. Animation Style (takes priority if selected)
  const animationStyle = ANIMATION_STYLES.find((s) => s.id === state.animationStyle);
  if (animationStyle) {
    parts.push(animationStyle.promptText);
  } else {
    // 3b. Art Style (one primary style, only if no animation style)
    const artStyle = ART_STYLES.find((s) => s.id === state.artStyle);
    if (artStyle) {
      parts.push(`${artStyle.keywords[0]} style`);
    }
  }

  // 4. Mood/Atmosphere
  const mood = MOODS.find((m) => m.id === state.mood);
  if (mood) {
    parts.push(`${mood.keywords[0]} atmosphere`);
  }

  // 5. Lighting
  const lighting = LIGHTING_OPTIONS.find((l) => l.id === state.lighting);
  if (lighting) {
    parts.push(lighting.keywords[0]);
  }

  // 6. Composition
  const composition = COMPOSITIONS.find((c) => c.id === state.composition);
  if (composition) {
    parts.push(composition.keywords[0]);
  }

  // 7. Background
  const background = BACKGROUNDS.find((b) => b.id === state.background);
  if (background) {
    parts.push(background.keywords[0]);
  }

  // 8. Text Content (with quotes and placement)
  if (state.textContent) {
    const textPlacement = TEXT_PLACEMENTS.find((p) => p.id === state.textPlacement);
    const textStyle = TEXT_STYLES.find((s) => s.id === state.textStyle);

    let textPart = `text "${state.textContent}"`;
    if (textPlacement) {
      textPart += `, ${textPlacement.keywords[0]}`;
    }
    if (textStyle) {
      textPart += `, ${textStyle.keywords[0]}`;
    }
    parts.push(textPart);
  }

  // 9. Color Scheme
  if (state.colorScheme) {
    parts.push(`${state.colorScheme} color palette`);
  }

  // 10. Additional Details
  if (state.additionalDetails) {
    parts.push(state.additionalDetails);
  }

  // Join with commas for clean structure
  return parts.join(", ");
}

/**
 * Generate suggested negative prompts based on the state
 */
export function generateNegativePrompt(state: PromptBuilderState): string {
  const negatives: string[] = [];

  // Base quality negatives
  negatives.push("blurry", "low quality", "distorted");

  // Category-specific negatives
  if (state.subjectCategory === "portrait") {
    negatives.push("bad anatomy", "deformed face", "extra limbs", "disfigured");
  }

  if (state.subjectCategory === "logo") {
    negatives.push("busy background", "complex textures", "photorealistic");
  }

  if (state.textContent) {
    negatives.push("misspelled text", "illegible", "overlapping letters");
  }

  // User's custom negatives
  if (state.negativePrompt) {
    negatives.push(state.negativePrompt);
  }

  return negatives.join(", ");
}

/**
 * Validate the prompt for common issues
 */
export function validatePrompt(prompt: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check prompt length
  if (prompt.length < 10) {
    warnings.push("Prompt is very short. Consider adding more details for better results.");
  }

  if (prompt.length > 2000) {
    warnings.push("Prompt is very long. Consider trimming for more focused results.");
  }

  // Check for conflicting styles
  const styleCount = [
    "photorealistic",
    "watercolor",
    "oil painting",
    "digital art",
    "anime",
    "3D render",
  ].filter((style) => prompt.toLowerCase().includes(style)).length;

  if (styleCount > 1) {
    warnings.push("Multiple art styles detected. Using one primary style typically yields better results.");
  }

  // Check text formatting
  const hasQuotedText = /"[^"]*"/.test(prompt);
  const mentionsText = /\b(text|word|letter|title|heading)\b/i.test(prompt);

  if (mentionsText && !hasQuotedText) {
    warnings.push('When including text in images, wrap the exact text in quotes: "Your Text Here"');
  }

  // Check for aspect ratio conflicts with content
  // (This would need actual aspect ratio passed in for real implementation)

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Extract keywords from a natural language description
 */
export function extractKeywords(description: string): string[] {
  // Common stop words to filter out
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "can", "i", "you", "we",
    "they", "it", "that", "this", "these", "those", "my", "your", "our",
    "their", "its", "what", "which", "who", "whom", "how", "when", "where",
    "why", "want", "need", "like", "make", "create", "generate", "please",
  ]);

  return description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Calculate prompt complexity score (0-100)
 */
export function calculateComplexity(state: PromptBuilderState): number {
  let score = 0;

  if (state.subject) score += 20;
  if (state.action) score += 10;
  if (state.setting) score += 10;
  if (state.artStyle || state.animationStyle) score += 15;
  if (state.mood) score += 10;
  if (state.lighting) score += 10;
  if (state.composition) score += 5;
  if (state.background) score += 5;
  if (state.textContent) score += 10;
  if (state.additionalDetails) score += 5;

  return Math.min(score, 100);
}

/**
 * Generate prompt variations
 */
export function generateVariations(basePrompt: string, count: number = 3): string[] {
  const variations: string[] = [];

  // Variation 1: Add quality enhancers
  variations.push(`${basePrompt}, highly detailed, professional quality, masterpiece`);

  // Variation 2: Add dramatic elements
  variations.push(`${basePrompt}, dramatic composition, striking visuals, award-winning`);

  // Variation 3: Add artistic flair
  variations.push(`${basePrompt}, artistically composed, visually stunning, creative interpretation`);

  return variations.slice(0, count);
}
