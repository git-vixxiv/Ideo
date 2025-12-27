// Ideogram Prompt Builder Constants

import type {
  SubjectCategory,
  StyleOption,
  MoodOption,
  LightingOption,
  CompositionOption,
} from "@/types/prompt";
import type { AspectRatio, StyleType, RenderingSpeed, ColorPalettePreset } from "@/types/ideogram";

// Subject Categories
export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    id: "portrait",
    name: "Portrait & People",
    icon: "👤",
    description: "Human subjects, faces, full body shots",
    subCategories: ["headshot", "full body", "group", "silhouette", "character design"],
  },
  {
    id: "landscape",
    name: "Landscape & Nature",
    icon: "🏞️",
    description: "Outdoor scenes, nature, environments",
    subCategories: ["mountain", "forest", "ocean", "desert", "urban", "fantasy landscape"],
  },
  {
    id: "product",
    name: "Product & Commercial",
    icon: "📦",
    description: "Product photography, mockups, advertisements",
    subCategories: ["packaging", "tech product", "food", "fashion", "cosmetics"],
  },
  {
    id: "logo",
    name: "Logo & Branding",
    icon: "🎨",
    description: "Logos, icons, brand identity elements",
    subCategories: ["wordmark", "lettermark", "icon", "mascot", "emblem"],
  },
  {
    id: "illustration",
    name: "Illustration & Art",
    icon: "🖼️",
    description: "Artistic illustrations, concept art",
    subCategories: ["concept art", "book illustration", "editorial", "children's", "fantasy"],
  },
  {
    id: "architecture",
    name: "Architecture & Interior",
    icon: "🏛️",
    description: "Buildings, interiors, architectural visualization",
    subCategories: ["exterior", "interior", "floor plan", "3D render", "modern", "classical"],
  },
  {
    id: "abstract",
    name: "Abstract & Pattern",
    icon: "🌀",
    description: "Abstract art, patterns, textures",
    subCategories: ["geometric", "organic", "fractal", "texture", "seamless pattern"],
  },
  {
    id: "poster",
    name: "Poster & Graphic Design",
    icon: "📄",
    description: "Posters, flyers, social media graphics",
    subCategories: ["movie poster", "event flyer", "social media", "banner", "infographic"],
  },
  {
    id: "fantasy",
    name: "Fantasy & Sci-Fi",
    icon: "🐉",
    description: "Fantasy creatures, sci-fi scenes, otherworldly",
    subCategories: ["creature", "spaceship", "alien world", "magic", "cyberpunk"],
  },
  {
    id: "food",
    name: "Food & Beverage",
    icon: "🍕",
    description: "Food photography, recipes, restaurant imagery",
    subCategories: ["plated dish", "ingredients", "drinks", "desserts", "cooking process"],
  },
];

// Art Styles
export const ART_STYLES: StyleOption[] = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Hyper-realistic photography style",
    keywords: ["photorealistic", "photo", "realistic", "DSLR", "8K", "detailed"],
    example: "photorealistic portrait, DSLR quality, 8K resolution",
  },
  {
    id: "digital_art",
    name: "Digital Art",
    description: "Modern digital illustration",
    keywords: ["digital art", "digital painting", "digital illustration"],
    example: "digital art style, vibrant colors, clean lines",
  },
  {
    id: "oil_painting",
    name: "Oil Painting",
    description: "Traditional oil painting aesthetic",
    keywords: ["oil painting", "impasto", "brush strokes", "classical painting"],
    example: "oil painting style, visible brush strokes, rich textures",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft watercolor painting style",
    keywords: ["watercolor", "soft edges", "flowing colors", "wet on wet"],
    example: "watercolor painting, soft washes, organic edges",
  },
  {
    id: "anime",
    name: "Anime & Manga",
    description: "Japanese animation style",
    keywords: ["anime", "manga", "cel shaded", "Japanese animation"],
    example: "anime style, large expressive eyes, cel shading",
  },
  {
    id: "3d_render",
    name: "3D Render",
    description: "Computer generated 3D graphics",
    keywords: ["3D render", "CGI", "Blender", "Cinema 4D", "octane render"],
    example: "3D render, octane render, subsurface scattering",
  },
  {
    id: "pixel_art",
    name: "Pixel Art",
    description: "Retro pixel-based graphics",
    keywords: ["pixel art", "8-bit", "16-bit", "retro game"],
    example: "pixel art style, 16-bit aesthetic, limited color palette",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple, minimal design",
    keywords: ["minimalist", "simple", "clean", "flat design"],
    example: "minimalist design, clean lines, simple shapes",
  },
  {
    id: "vintage",
    name: "Vintage & Retro",
    description: "Nostalgic, vintage aesthetics",
    keywords: ["vintage", "retro", "nostalgic", "old school", "film grain"],
    example: "vintage style, film grain, muted colors, retro aesthetic",
  },
  {
    id: "pop_art",
    name: "Pop Art",
    description: "Bold, vibrant pop art style",
    keywords: ["pop art", "bold colors", "Ben-Day dots", "Andy Warhol"],
    example: "pop art style, bold primary colors, comic book aesthetic",
  },
  {
    id: "sketch",
    name: "Sketch & Line Art",
    description: "Hand-drawn sketch style",
    keywords: ["sketch", "pencil drawing", "line art", "hand drawn"],
    example: "pencil sketch, detailed line work, crosshatching",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Movie-quality dramatic visuals",
    keywords: ["cinematic", "dramatic lighting", "film still", "movie scene"],
    example: "cinematic shot, dramatic lighting, anamorphic lens",
  },
  {
    id: "isometric",
    name: "Isometric",
    description: "Isometric perspective illustrations",
    keywords: ["isometric", "isometric view", "2.5D"],
    example: "isometric illustration, 45-degree angle, clean geometry",
  },
  {
    id: "comic",
    name: "Comic Book",
    description: "Western comic book style",
    keywords: ["comic book", "graphic novel", "bold outlines", "halftone"],
    example: "comic book style, bold outlines, dynamic action lines",
  },
  {
    id: "surreal",
    name: "Surrealist",
    description: "Dreamlike surreal imagery",
    keywords: ["surreal", "surrealist", "dreamlike", "Salvador Dali"],
    example: "surrealist art, dreamlike, impossible perspectives",
  },
];

// Moods & Atmospheres
export const MOODS: MoodOption[] = [
  { id: "peaceful", name: "Peaceful", description: "Calm and serene", keywords: ["peaceful", "calm", "serene", "tranquil"] },
  { id: "dramatic", name: "Dramatic", description: "Intense and powerful", keywords: ["dramatic", "intense", "powerful", "bold"] },
  { id: "mysterious", name: "Mysterious", description: "Enigmatic and intriguing", keywords: ["mysterious", "enigmatic", "moody", "dark"] },
  { id: "joyful", name: "Joyful", description: "Happy and uplifting", keywords: ["joyful", "happy", "cheerful", "vibrant"] },
  { id: "melancholic", name: "Melancholic", description: "Sad and contemplative", keywords: ["melancholic", "sad", "contemplative", "somber"] },
  { id: "energetic", name: "Energetic", description: "Dynamic and lively", keywords: ["energetic", "dynamic", "lively", "action"] },
  { id: "romantic", name: "Romantic", description: "Soft and romantic", keywords: ["romantic", "soft", "dreamy", "love"] },
  { id: "eerie", name: "Eerie", description: "Unsettling and strange", keywords: ["eerie", "unsettling", "creepy", "ominous"] },
  { id: "nostalgic", name: "Nostalgic", description: "Wistful and reminiscent", keywords: ["nostalgic", "wistful", "vintage", "memory"] },
  { id: "epic", name: "Epic", description: "Grand and majestic", keywords: ["epic", "grand", "majestic", "monumental"] },
  { id: "whimsical", name: "Whimsical", description: "Playful and fanciful", keywords: ["whimsical", "playful", "fanciful", "quirky"] },
  { id: "minimalist", name: "Minimalist", description: "Clean and simple", keywords: ["minimalist", "clean", "simple", "understated"] },
];

// Lighting Options
export const LIGHTING_OPTIONS: LightingOption[] = [
  { id: "natural", name: "Natural Light", keywords: ["natural light", "daylight", "outdoor lighting"] },
  { id: "golden_hour", name: "Golden Hour", keywords: ["golden hour", "warm sunset light", "magic hour"] },
  { id: "blue_hour", name: "Blue Hour", keywords: ["blue hour", "twilight", "dusk lighting"] },
  { id: "studio", name: "Studio Lighting", keywords: ["studio lighting", "professional lighting", "softbox"] },
  { id: "dramatic", name: "Dramatic Lighting", keywords: ["dramatic lighting", "chiaroscuro", "high contrast"] },
  { id: "soft", name: "Soft Diffused", keywords: ["soft light", "diffused lighting", "overcast"] },
  { id: "rim", name: "Rim Lighting", keywords: ["rim light", "backlit", "edge lighting"] },
  { id: "neon", name: "Neon Lighting", keywords: ["neon lights", "neon glow", "cyberpunk lighting"] },
  { id: "cinematic", name: "Cinematic", keywords: ["cinematic lighting", "movie lighting", "volumetric"] },
  { id: "ambient", name: "Ambient", keywords: ["ambient lighting", "soft ambient", "indirect light"] },
  { id: "spotlight", name: "Spotlight", keywords: ["spotlight", "focused light", "stage lighting"] },
  { id: "moody", name: "Moody Low Key", keywords: ["low key lighting", "moody", "dark shadows"] },
];

// Composition Options
export const COMPOSITIONS: CompositionOption[] = [
  { id: "centered", name: "Centered", description: "Subject in center", keywords: ["centered composition", "symmetrical"] },
  { id: "rule_of_thirds", name: "Rule of Thirds", description: "Off-center placement", keywords: ["rule of thirds", "off-center"] },
  { id: "symmetrical", name: "Symmetrical", description: "Mirror symmetry", keywords: ["symmetrical", "mirror", "balanced"] },
  { id: "diagonal", name: "Diagonal", description: "Dynamic diagonal lines", keywords: ["diagonal composition", "dynamic angle"] },
  { id: "minimal", name: "Minimal", description: "Lots of negative space", keywords: ["minimal composition", "negative space", "simple"] },
  { id: "full_frame", name: "Full Frame", description: "Subject fills frame", keywords: ["full frame", "close crop", "tight framing"] },
  { id: "wide_shot", name: "Wide Shot", description: "Expansive view", keywords: ["wide shot", "establishing shot", "panoramic"] },
  { id: "closeup", name: "Close-Up", description: "Intimate detail view", keywords: ["close-up", "macro", "detail shot"] },
  { id: "overhead", name: "Overhead/Top-Down", description: "Bird's eye view", keywords: ["overhead", "top-down", "bird's eye", "flat lay"] },
  { id: "worms_eye", name: "Worm's Eye", description: "Low angle looking up", keywords: ["worm's eye", "low angle", "looking up"] },
];

// Text Placement Options
export const TEXT_PLACEMENTS = [
  { id: "centered", name: "Centered", keywords: ["centered text", "middle"] },
  { id: "top", name: "Top", keywords: ["top text", "header"] },
  { id: "bottom", name: "Bottom", keywords: ["bottom text", "footer"] },
  { id: "top_arc", name: "Top Arc", keywords: ["curved text top", "arc text"] },
  { id: "bottom_arc", name: "Bottom Arc", keywords: ["curved text bottom", "bottom arc"] },
  { id: "left", name: "Left Aligned", keywords: ["left aligned text"] },
  { id: "right", name: "Right Aligned", keywords: ["right aligned text"] },
  { id: "diagonal", name: "Diagonal", keywords: ["diagonal text", "angled text"] },
  { id: "circular", name: "Circular", keywords: ["circular text", "text around circle"] },
];

// Text Styles
export const TEXT_STYLES = [
  { id: "bold", name: "Bold & Modern", keywords: ["bold typography", "modern font", "sans-serif"] },
  { id: "elegant", name: "Elegant Script", keywords: ["script font", "elegant typography", "cursive"] },
  { id: "retro", name: "Retro/Vintage", keywords: ["retro typography", "vintage lettering", "classic font"] },
  { id: "handwritten", name: "Handwritten", keywords: ["handwritten", "hand lettering", "brush script"] },
  { id: "minimal", name: "Minimal & Clean", keywords: ["minimal typography", "clean font", "simple text"] },
  { id: "grunge", name: "Grunge/Distressed", keywords: ["grunge text", "distressed typography", "rough edges"] },
  { id: "neon", name: "Neon Glow", keywords: ["neon text", "glowing letters", "neon sign"] },
  { id: "3d", name: "3D Text", keywords: ["3D text", "extruded letters", "dimensional typography"] },
  { id: "outline", name: "Outline/Stroke", keywords: ["outline text", "stroke text", "hollow letters"] },
  { id: "gradient", name: "Gradient", keywords: ["gradient text", "colorful letters", "rainbow text"] },
];

// Background Options
export const BACKGROUNDS = [
  { id: "transparent", name: "Transparent", keywords: ["transparent background", "no background"] },
  { id: "white", name: "Solid White", keywords: ["white background", "clean white"] },
  { id: "black", name: "Solid Black", keywords: ["black background", "dark background"] },
  { id: "gradient", name: "Gradient", keywords: ["gradient background", "color gradient"] },
  { id: "blurred", name: "Blurred/Bokeh", keywords: ["blurred background", "bokeh", "shallow depth of field"] },
  { id: "studio", name: "Studio Backdrop", keywords: ["studio backdrop", "professional backdrop"] },
  { id: "environmental", name: "Environmental", keywords: ["environmental background", "contextual setting"] },
  { id: "abstract", name: "Abstract", keywords: ["abstract background", "artistic backdrop"] },
  { id: "texture", name: "Textured", keywords: ["textured background", "paper texture", "fabric texture"] },
  { id: "pastel", name: "Solid Pastel", keywords: ["pastel background", "soft color background"] },
];

// Aspect Ratio Labels
export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string; dimensions: string }[] = [
  { value: "ASPECT_1_1", label: "Square (1:1)", dimensions: "1024 × 1024" },
  { value: "ASPECT_16_9", label: "Widescreen (16:9)", dimensions: "1344 × 768" },
  { value: "ASPECT_9_16", label: "Portrait (9:16)", dimensions: "768 × 1344" },
  { value: "ASPECT_4_3", label: "Standard (4:3)", dimensions: "1184 × 880" },
  { value: "ASPECT_3_4", label: "Portrait (3:4)", dimensions: "880 × 1184" },
  { value: "ASPECT_3_2", label: "Photo (3:2)", dimensions: "1248 × 832" },
  { value: "ASPECT_2_3", label: "Portrait Photo (2:3)", dimensions: "832 × 1248" },
  { value: "ASPECT_16_10", label: "Wide (16:10)", dimensions: "1312 × 816" },
  { value: "ASPECT_10_16", label: "Tall (10:16)", dimensions: "816 × 1312" },
  { value: "ASPECT_1_2", label: "Tall Portrait (1:2)", dimensions: "736 × 1472" },
  { value: "ASPECT_2_1", label: "Panoramic (2:1)", dimensions: "1472 × 736" },
  { value: "ASPECT_1_3", label: "Very Tall (1:3)", dimensions: "608 × 1824" },
  { value: "ASPECT_3_1", label: "Ultra Wide (3:1)", dimensions: "1824 × 608" },
];

// Style Type Labels
export const STYLE_TYPE_OPTIONS: { value: StyleType; label: string; description: string }[] = [
  { value: "AUTO", label: "Auto", description: "Let Ideogram choose the best style" },
  { value: "GENERAL", label: "General", description: "Versatile all-purpose style" },
  { value: "REALISTIC", label: "Realistic", description: "Photo-realistic imagery" },
  { value: "DESIGN", label: "Design", description: "Graphic design and illustrations" },
  { value: "RENDER_3D", label: "3D Render", description: "3D computer graphics" },
  { value: "ANIME", label: "Anime", description: "Japanese animation style" },
];

// Rendering Speed Options
export const RENDERING_SPEED_OPTIONS: { value: RenderingSpeed; label: string; description: string; price: string }[] = [
  { value: "TURBO", label: "Turbo", description: "Fastest generation", price: "$0.03" },
  { value: "BALANCED", label: "Balanced", description: "Good balance of speed and quality", price: "$0.06" },
  { value: "QUALITY", label: "Quality", description: "Highest quality output", price: "$0.09" },
];

// Color Palette Presets
export const COLOR_PALETTE_PRESETS: { value: ColorPalettePreset; label: string; colors: string[] }[] = [
  { value: "EMBER", label: "Ember", colors: ["#FF6B35", "#F7931E", "#FFD700", "#8B0000"] },
  { value: "FRESH", label: "Fresh", colors: ["#7CB342", "#4CAF50", "#8BC34A", "#CDDC39"] },
  { value: "JUNGLE", label: "Jungle", colors: ["#2E7D32", "#1B5E20", "#388E3C", "#4CAF50"] },
  { value: "MAGIC", label: "Magic", colors: ["#9C27B0", "#7B1FA2", "#E040FB", "#EA80FC"] },
  { value: "MELON", label: "Melon", colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#98D8C8"] },
  { value: "MOSAIC", label: "Mosaic", colors: ["#E91E63", "#00BCD4", "#FFEB3B", "#4CAF50"] },
  { value: "PASTEL", label: "Pastel", colors: ["#FFB5E8", "#B5DEFF", "#FFFFD1", "#E7FFAC"] },
  { value: "ULTRAMARINE", label: "Ultramarine", colors: ["#1A237E", "#303F9F", "#3F51B5", "#5C6BC0"] },
];

// Common Negative Prompts
export const COMMON_NEGATIVE_PROMPTS = [
  "blurry",
  "low quality",
  "distorted",
  "ugly",
  "deformed",
  "bad anatomy",
  "watermark",
  "text",
  "logo",
  "signature",
  "cropped",
  "out of frame",
  "extra limbs",
  "disfigured",
  "mutation",
  "poorly drawn",
  "bad proportions",
  "duplicate",
  "morbid",
  "mutilated",
];

// Default Prompt Builder State
export const DEFAULT_PROMPT_STATE = {
  mode: "generate" as const,
  subject: "",
  subjectCategory: "",
  action: "",
  setting: "",
  styleType: "AUTO" as StyleType,
  artStyle: "",
  mood: "",
  lighting: "",
  colorScheme: "",
  aspectRatio: "ASPECT_1_1" as AspectRatio,
  renderingSpeed: "BALANCED" as RenderingSpeed,
  colorPalette: null,
  customColors: [],
  magicPrompt: "AUTO" as const,
  seed: null,
  numImages: 1,
  textContent: "",
  textPlacement: "",
  textStyle: "",
  composition: "",
  perspective: "",
  background: "",
  negativePrompt: "",
  styleReferenceImage: null,
  characterReferenceImage: null,
  sourceImage: null,
  maskImage: null,
  imageWeight: 50,
  additionalDetails: "",
};
