import { NextRequest, NextResponse } from "next/server";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/remix";

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
    const { image_file, image_weight, prompt, aspect_ratio, style_type, magic_prompt_option, seed, num_images, color_palette, negative_prompt } = body;

    if (!image_file) {
      return NextResponse.json(
        { error: "Please upload an image to remix." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Please enter a prompt description for the remix." },
        { status: 400 }
      );
    }

    // Build the image_request object
    const imageRequest: Record<string, unknown> = {
      prompt: prompt.trim(),
      aspect_ratio: aspect_ratio || "ASPECT_1_1",
      model: "V_2",
      magic_prompt_option: magic_prompt_option || "OFF",
      num_images: num_images || 1,
    };

    // Only include optional fields if they have values
    if (image_weight !== undefined) {
      imageRequest.image_weight = image_weight;
    }
    if (style_type && style_type !== "AUTO") {
      imageRequest.style_type = style_type;
    }
    if (seed) {
      imageRequest.seed = seed;
    }
    if (negative_prompt) {
      imageRequest.negative_prompt = negative_prompt;
    }
    if (color_palette) {
      imageRequest.color_palette = color_palette;
    }

    // Convert base64 to blob for the image file
    const base64Data = image_file.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });

    // Build multipart form data
    const formData = new FormData();
    formData.append("image_request", JSON.stringify(imageRequest));
    formData.append("image_file", imageBlob, "image.png");

    console.log("Remix request:", { imageRequest, hasImageFile: true });

    const response = await fetch(IDEOGRAM_API_URL, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Ideogram API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText;
        }
      }
      console.error("Remix API error:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Ideogram remix response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ideogram Remix API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remix image. Please try again." },
      { status: 500 }
    );
  }
}
