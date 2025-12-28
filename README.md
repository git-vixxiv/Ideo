# iddy - AI Image Prompt Builder for Ideogram

A powerful web application that helps you craft the perfect prompts for Ideogram AI image generation, powered by Claude for intelligent prompt optimization.

## Features

### Guided Prompt Building
- **Subject Categories**: Choose from 10 different categories including Portrait, Landscape, Product, Logo, Illustration, and more
- **Art Styles**: 15+ art styles from Photorealistic to Anime to Pixel Art
- **Mood & Atmosphere**: Set the emotional tone with options like Peaceful, Dramatic, Mysterious, and more
- **Lighting Options**: Natural, Golden Hour, Studio, Cinematic, Neon, and more
- **Composition**: Rule of thirds, centered, diagonal, and other composition options
- **Background Control**: Transparent, solid colors, gradients, blurred, and more

### Text in Images
- Smart text handling with automatic quote wrapping
- Text placement options (centered, top, bottom, arc, etc.)
- Typography style selection (bold, elegant, retro, neon, etc.)

### Technical Settings
- All Ideogram aspect ratios supported (1:1, 16:9, 9:16, and more)
- Rendering speed options (Turbo, Balanced, Quality)
- Magic Prompt toggle
- Custom seed for reproducible results
- Number of images (1-8)
- Color palette presets and custom colors

### Claude AI Integration
- One-click prompt optimization
- Intelligent suggestions based on Ideogram best practices
- Automatic negative prompt generation
- Explanation of improvements

### Reference Images
- Style reference upload for consistent aesthetics
- Character reference for face consistency
- Image remix with strength control
- Inpainting/edit mode with mask support

### Generation Modes
- **Generate**: Text-to-image creation
- **Remix**: Transform existing images with prompts
- **Edit**: Inpaint specific areas using masks
- **Upscale**: Enhance image resolution
- **Describe**: Get prompt suggestions from images

### User Accounts (with Supabase)
- **Google Sign-In**: Secure authentication with your Google account
- **Saved Prompts**: Save your best prompts for reuse
- **Prompt Rating**: Rate prompts 1-5 stars based on results
- **Collections**: Organize prompts into custom collections
- **Color Schemes**: Save custom color palettes
- **Generation History**: Track all your generations with ratings
- **Cloud Sync**: Access your data from any device

## Getting Started

### Prerequisites
- Node.js 18+
- Claude API key (from [console.anthropic.com](https://console.anthropic.com))
- Ideogram API key (from [developer.ideogram.ai](https://developer.ideogram.ai))
- Supabase project (optional, for user accounts)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd iddy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

#### Basic Setup (Local Mode)
1. Click the **Settings** icon in the header
2. Enter your Claude API key
3. Enter your Ideogram API key
4. Click **Save Settings**

Your API keys are stored locally in your browser.

#### With Supabase (User Accounts)
1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the SQL Editor
3. Enable Google OAuth in Authentication → Providers
4. Add your Supabase URL and anon key to `.env.local`
5. Deploy!

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Google OAuth
- **APIs**: Claude API, Ideogram API
- **Deployment**: Vercel (recommended)

## Brand Colors

iddy uses a sophisticated color palette:
- **Primary Black**: `#1A1A1A`
- **Primary Gold**: `#998748`
- **Accent Blue**: `#2589bd`
- **Platinum**: `#f4f4f4`
- **Light Gold**: `#d1c69e`

## Cost

The app itself is **free to use**. You only pay for:
- Claude API usage (for prompt optimization)
- Ideogram API usage (for image generation)
- Supabase (free tier is generous - 50K monthly active users)

Ideogram pricing per image:
- Turbo: $0.03
- Balanced: $0.06
- Quality: $0.09

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables (if using Supabase)
4. Deploy!

### Environment Variables

For Supabase user accounts:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Self-hosted with `npm run build && npm start`

## Ideogram Prompt Best Practices

iddy is built with Ideogram best practices in mind:

1. **Lead with the subject**: The most important element should come first
2. **One style, one subject**: Avoid mixing conflicting styles
3. **Quote your text**: Text to appear in images is wrapped in quotes
4. **Specify backgrounds**: Explicit background instructions yield cleaner results
5. **Pin text placement**: Use terms like "centered", "top arc", "bottom footer"
6. **Keep text short**: Shorter text has fewer errors
7. **Use mood words**: Terms like "whimsical" or "dramatic" shape the output

## License

MIT License - feel free to use and modify as needed.
