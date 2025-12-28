import { NextRequest, NextResponse } from "next/server";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/generate";

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
      magic_prompt_option = "OFF",
      seed,
      num_images = 1,
      color_palette,
    } = body;

    // Validate prompt is not empty
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Please enter a prompt description before generating an image." },
        { status: 400 }
      );
    }

    // Build the image_request object for Ideogram V2 API
    const imageRequest: Record<string, unknown> = {
      prompt: prompt.trim(),
      aspect_ratio,
      model: "V_2",
      magic_prompt_option,
      num_images,
    };

    // Only add style_type if not AUTO (some APIs don't accept it)
    if (style_type && style_type !== "AUTO") {
      imageRequest.style_type = style_type;
    }

    if (negative_prompt) {
      imageRequest.negative_prompt = negative_prompt;
    }

    if (seed !== undefined && seed !== null && seed !== "") {
      imageRequest.seed = Number(seed);
    }

    if (color_palette) {
      imageRequest.color_palette = color_palette;
    }

    // The Ideogram API expects image_request wrapper
    const requestBody = {
      image_request: imageRequest,
    };

    console.log("Sending to Ideogram API:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(IDEOGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ideogram API error response:", errorText);
      let errorMessage = `Ideogram API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.detail) {
          // Handle validation errors
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((d: { msg?: string; message?: string }) => d.msg || d.message).join(", ");
          } else {
            errorMessage = errorData.detail;
          }
        } else {
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch {
        // If parsing fails, use the raw text if it's not too long
        if (errorText && errorText.length < 200) {
          errorMessage = errorText;
        }
      }
      return NextResponse.json(
        { error: errorMessage },
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
