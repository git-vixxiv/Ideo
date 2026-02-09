// Ideogram Prompt Builder Constants

import type {
  SubjectCategory,
  StyleOption,
  MoodOption,
  LightingOption,
  CompositionOption,
  AnimationStyle,
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

// Animation Styles (based on popular cartoons and anime)
export const ANIMATION_STYLES: AnimationStyle[] = [
  // Western Animation - Classic
  { id: "futurama", name: "Futurama", promptText: "in Futurama animation style, Matt Groening art style, simple outlines, bold colors, overbite characters", category: "western" },
  { id: "family_guy", name: "Family Guy", promptText: "in Family Guy animation style, Seth MacFarlane style, round heads, simple features, thick outlines", category: "western" },
  { id: "south_park", name: "South Park", promptText: "in South Park animation style, construction paper cutout style, simple shapes, flat colors, minimalist features", category: "western" },
  { id: "simpsons", name: "The Simpsons", promptText: "in The Simpsons animation style, yellow skin, overbite, Matt Groening style, bold outlines", category: "western" },
  { id: "american_dad", name: "American Dad", promptText: "in American Dad animation style, Seth MacFarlane style, realistic proportions, clean lines", category: "western" },
  { id: "bobs_burgers", name: "Bob's Burgers", promptText: "in Bob's Burgers animation style, Loren Bouchard style, simple features, no chin, round ears", category: "western" },
  { id: "archer", name: "Archer", promptText: "in Archer animation style, sleek art deco inspired, realistic proportions, bold lines, limited shading", category: "western" },
  { id: "rick_and_morty", name: "Rick and Morty", promptText: "in Rick and Morty animation style, Justin Roiland style, drippy lines, exaggerated expressions, sci-fi aesthetic", category: "western" },

  // Western Animation - Kids/Cartoon Network
  { id: "powerpuff_girls", name: "Powerpuff Girls", promptText: "in Powerpuff Girls animation style, Craig McCracken style, huge eyes, tiny body, no fingers, bold colors", category: "western" },
  { id: "dexters_lab", name: "Dexter's Laboratory", promptText: "in Dexter's Laboratory animation style, Genndy Tartakovsky style, angular shapes, exaggerated proportions", category: "western" },
  { id: "samurai_jack", name: "Samurai Jack", promptText: "in Samurai Jack animation style, Genndy Tartakovsky style, geometric shapes, bold shadows, minimal lines", category: "western" },
  { id: "fairly_oddparents", name: "Fairly OddParents", promptText: "in Fairly OddParents animation style, Butch Hartman style, angular shapes, bright colors, big heads", category: "western" },
  { id: "danny_phantom", name: "Danny Phantom", promptText: "in Danny Phantom animation style, Butch Hartman style, angular features, dynamic poses, glowing effects", category: "western" },
  { id: "johnny_test", name: "Johnny Test", promptText: "in Johnny Test animation style, flash animation style, flame-shaped hair, bold outlines", category: "western" },
  { id: "knd", name: "Kids Next Door", promptText: "in Codename Kids Next Door animation style, Tom Warburton style, diverse body types, chunky designs", category: "western" },
  { id: "teen_titans", name: "Teen Titans", promptText: "in Teen Titans 2003 animation style, anime-influenced, dynamic action poses, dramatic lighting", category: "western" },
  { id: "teen_titans_go", name: "Teen Titans Go!", promptText: "in Teen Titans Go animation style, chibi style, simple shapes, bright colors, comedic expressions", category: "western" },
  { id: "gravity_falls", name: "Gravity Falls", promptText: "in Gravity Falls animation style, Alex Hirsch style, rounded features, expressive eyes, mystery aesthetic", category: "western" },
  { id: "spongebob", name: "SpongeBob SquarePants", promptText: "in SpongeBob SquarePants animation style, Stephen Hillenburg style, underwater aesthetic, exaggerated expressions", category: "western" },
  { id: "invader_zim", name: "Invader Zim", promptText: "in Invader Zim animation style, Jhonen Vasquez style, angular gothic style, green and purple palette, alien aesthetic", category: "western" },

  // Western Animation - Nickelodeon
  { id: "hey_arnold", name: "Hey Arnold!", promptText: "in Hey Arnold animation style, Craig Bartlett style, football-shaped head, urban setting, jazzy aesthetic", category: "western" },
  { id: "scooby_doo", name: "Scooby-Doo", promptText: "in Scooby-Doo animation style, Hanna-Barbera style, mystery aesthetic, 70s color palette", category: "western" },
  { id: "kim_possible", name: "Kim Possible", promptText: "in Kim Possible animation style, sleek action style, dynamic poses, teen spy aesthetic", category: "western" },
  { id: "phineas_ferb", name: "Phineas and Ferb", promptText: "in Phineas and Ferb animation style, Dan Povenmire style, triangular and rectangular heads, bright summer colors", category: "western" },
  { id: "total_drama", name: "Total Drama", promptText: "in Total Drama Island animation style, reality TV parody style, exaggerated features, teen character designs", category: "western" },
  { id: "6teen", name: "6teen", promptText: "in 6teen animation style, Canadian flash animation, mall setting, teen slice of life aesthetic", category: "western" },

  // Western Animation - Other
  { id: "peanuts", name: "Peanuts", promptText: "in Peanuts animation style, Charles Schulz style, round heads, simple dot eyes, vintage comic strip aesthetic", category: "western" },
  { id: "garfield", name: "Garfield", promptText: "in Garfield animation style, Jim Davis style, chunky cat design, lasagna lover, orange tabby", category: "western" },
  { id: "happy_tree_friends", name: "Happy Tree Friends", promptText: "in Happy Tree Friends animation style, cute forest creatures, pastel colors, deceptively cute aesthetic", category: "western" },
  { id: "code_lyoko", name: "Code Lyoko", promptText: "in Code Lyoko animation style, French anime-influenced, 2D and 3D hybrid, virtual world aesthetic", category: "western" },
  { id: "totally_spies", name: "Totally Spies", promptText: "in Totally Spies animation style, French spy animation, fashion-forward, colorful spy gadgets", category: "western" },
  { id: "teenage_robot", name: "My Life as a Teenage Robot", promptText: "in My Life as a Teenage Robot animation style, retro-futuristic, 1950s aesthetic, robot girl design", category: "western" },
  { id: "winx_club", name: "Winx Club", promptText: "in Winx Club animation style, Italian magical girl, fashion fairy aesthetic, sparkles and wings", category: "western" },
  { id: "monster_high", name: "Monster High", promptText: "in Monster High animation style, monster teenager aesthetic, fashion-forward, gothic glam style", category: "western" },
  { id: "juniper_lee", name: "Juniper Lee", promptText: "in Life and Times of Juniper Lee animation style, magical girl action, Asian-American protagonist", category: "western" },
  { id: "justice_league", name: "Justice League", promptText: "in Justice League Unlimited animation style, Bruce Timm DCAU style, angular heroic designs, dramatic shadows", category: "western" },

  // Anime Styles
  { id: "pokemon", name: "Pokemon", promptText: "in Pokemon anime style, bright colors, creature design, shonen adventure aesthetic, Ken Sugimori influenced", category: "anime" },
  { id: "naruto", name: "Naruto", promptText: "in Naruto anime style, ninja aesthetic, dynamic action poses, Studio Pierrot style, detailed backgrounds", category: "anime" },
  { id: "one_piece", name: "One Piece", promptText: "in One Piece anime style, Eiichiro Oda style, exaggerated proportions, pirate adventure aesthetic", category: "anime" },
  { id: "avatar", name: "Avatar: The Last Airbender", promptText: "in Avatar The Last Airbender animation style, anime-influenced American animation, elemental bending, Asian-inspired aesthetic", category: "anime" },
  { id: "sailor_moon", name: "Sailor Moon", promptText: "in Sailor Moon anime style, magical girl aesthetic, sparkles and transformation, 90s shoujo style", category: "anime" },
  { id: "yugioh", name: "Yu-Gi-Oh!", promptText: "in Yu-Gi-Oh anime style, Kazuki Takahashi style, spiky hair, card game aesthetic, dramatic poses", category: "anime" },
  { id: "studio_ghibli", name: "Studio Ghibli", promptText: "in Studio Ghibli animation style, Hayao Miyazaki style, lush backgrounds, whimsical characters, hand-painted aesthetic", category: "anime" },
  { id: "dragon_ball", name: "Dragon Ball", promptText: "in Dragon Ball anime style, Akira Toriyama style, spiky hair, muscular characters, energy auras", category: "anime" },

  // Video Game Styles
  { id: "minecraft", name: "Minecraft", promptText: "in Minecraft style, blocky pixel art, voxel aesthetic, cubic characters, 16-bit texture style", category: "video_game" },
  { id: "sonic", name: "Sonic the Hedgehog", promptText: "in Sonic the Hedgehog style, SEGA style, anthropomorphic animal, blue speedster aesthetic, loop-de-loops", category: "video_game" },
  { id: "mario", name: "Super Mario Bros", promptText: "in Super Mario Bros style, Nintendo style, colorful mushroom kingdom, platformer aesthetic, pixel-inspired", category: "video_game" },

  // Other Styles
  { id: "disney", name: "Disney", promptText: "in Disney animation style, classic Disney princess aesthetic, expressive eyes, flowing animation, magical fairy tale", category: "other" },
  { id: "gorillaz", name: "Gorillaz", promptText: "in Gorillaz art style, Jamie Hewlett style, urban aesthetic, virtual band, edgy cartoon style", category: "other" },
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
  animationStyle: "",
  mood: "",
  lighting: "",
  colorScheme: "",
  aspectRatio: "ASPECT_1_1" as AspectRatio,
  renderingSpeed: "BALANCED" as RenderingSpeed,
  colorPalette: null,
  customColors: [],
  magicPrompt: "OFF" as const,
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
