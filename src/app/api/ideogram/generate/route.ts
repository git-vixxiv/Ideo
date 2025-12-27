import { NextRequest, NextResponse } from "next/server";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/v1/ideogram-v3/generate";

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Ideogram API key is required. Please add your API key in settings." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      prompt,
      negative_prompt,
      aspect_ratio = "ASPECT_1_1",
      style_type = "AUTO",
      magic_prompt_option = "AUTO",
      seed,
      num_images = 1,
      rendering_speed = "BALANCED",
      color_palette,
      style_reference_images,
      character_reference_images,
    } = body;

    // Build the request body
    const requestBody: Record<string, unknown> = {
      prompt,
      aspect_ratio,
      style_type,
      magic_prompt_option,
      num_images,
      rendering_speed,
    };

    if (negative_prompt) {
      requestBody.negative_prompt = negative_prompt;
    }

    if (seed !== undefined && seed !== null) {
      requestBody.seed = seed;
    }

    if (color_palette) {
      requestBody.color_palette = color_palette;
    }

    // Handle style reference images (up to 10MB total)
    if (style_reference_images && style_reference_images.length > 0) {
      requestBody.style_reference_images = style_reference_images;
    }

    // Handle character reference images (currently only 1 supported)
    if (character_reference_images && character_reference_images.length > 0) {
      requestBody.character_reference_images = character_reference_images.slice(0, 1);
    }

    const response = await fetch(IDEOGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || `Ideogram API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ideogram Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}
