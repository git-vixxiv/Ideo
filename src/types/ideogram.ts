// Ideogram API Types

export type AspectRatio =
  | "ASPECT_1_1"
  | "ASPECT_16_9"
  | "ASPECT_9_16"
  | "ASPECT_4_3"
  | "ASPECT_3_4"
  | "ASPECT_3_2"
  | "ASPECT_2_3"
  | "ASPECT_16_10"
  | "ASPECT_10_16"
  | "ASPECT_1_2"
  | "ASPECT_2_1"
  | "ASPECT_1_3"
  | "ASPECT_3_1";

export type StyleType =
  | "AUTO"
  | "GENERAL"
  | "REALISTIC"
  | "DESIGN"
  | "RENDER_3D"
  | "ANIME";

export type RenderingSpeed = "TURBO" | "BALANCED" | "QUALITY";

export type ColorPalettePreset =
  | "EMBER"
  | "FRESH"
  | "JUNGLE"
  | "MAGIC"
  | "MELON"
  | "MOSAIC"
  | "PASTEL"
  | "ULTRAMARINE";

export interface ColorPaletteCustom {
  members: Array<{
    color: string; // hex color
    weight?: number;
  }>;
}

export type ColorPalette =
  | { name: ColorPalettePreset }
  | ColorPaletteCustom;

export interface GenerateRequest {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: AspectRatio;
  model?: string;
  style_type?: StyleType;
  magic_prompt_option?: "ON" | "OFF" | "AUTO";
  seed?: number;
  num_images?: number;
  rendering_speed?: RenderingSpeed;
  color_palette?: ColorPalette;
  style_reference_images?: string[]; // base64 encoded
  character_reference_images?: string[]; // base64 encoded
}

export interface RemixRequest extends GenerateRequest {
  image_file: string; // base64 encoded
  image_weight?: number; // 0-100
}

export interface EditRequest {
  image_file: string; // base64 encoded
  mask: string; // base64 encoded
  prompt: string;
  magic_prompt_option?: "ON" | "OFF" | "AUTO";
  num_images?: number;
  seed?: number;
  rendering_speed?: RenderingSpeed;
  style_type?: StyleType;
  color_palette?: ColorPalette;
}

export interface UpscaleRequest {
  image_file: string; // base64 encoded
  prompt?: string;
  resemblance?: number; // 0-100
  detail?: number; // 0-100
}

export interface DescribeRequest {
  image_file: string; // base64 encoded
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  resolution: string;
  is_image_safe: boolean;
  seed: number;
}

export interface GenerateResponse {
  created: string;
  data: GeneratedImage[];
}

export interface DescribeResponse {
  descriptions: Array<{
    text: string;
  }>;
}

// Generation mode for the app
export type GenerationMode = "generate" | "remix" | "edit" | "upscale" | "describe";
