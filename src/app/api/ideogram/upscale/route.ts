import { NextRequest, NextResponse } from "next/server";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/upscale";

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
    const { image_file, prompt } = body;

    if (!image_file) {
      return NextResponse.json(
        { error: "Please upload an image to upscale." },
        { status: 400 }
      );
    }

    // Build the image_request object
    const imageRequest: Record<string, unknown> = {};

    // Prompt is optional for upscale
    if (prompt && typeof prompt === "string" && prompt.trim()) {
      imageRequest.prompt = prompt.trim();
    }

    // Convert base64 to blob for the image file
    const base64Data = image_file.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const imageBlob = new Blob([imageBuffer], { type: "image/png" });

    // Build multipart form data
    const formData = new FormData();
    formData.append("image_request", JSON.stringify(imageRequest));
    formData.append("image_file", imageBlob, "image.png");

    console.log("Upscale request:", { imageRequest, hasImageFile: true });

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
      console.error("Upscale API error:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Ideogram upscale response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ideogram Upscale API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upscale image. Please try again." },
      { status: 500 }
    );
  }
}
