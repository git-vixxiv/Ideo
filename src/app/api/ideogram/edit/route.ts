import { NextRequest, NextResponse } from "next/server";
import { getIdeogramApiKey } from "@/lib/api-keys";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/edit";

export async function POST(request: NextRequest) {
  try {
    const apiKey = await getIdeogramApiKey(request);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Ideogram API key is required. Please add your API key in settings." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image_file, mask, prompt, aspect_ratio, style_type, magic_prompt_option, seed, num_images, color_palette, negative_prompt } = body;

    if (!image_file) {
      return NextResponse.json(
        { error: "Please upload an image to edit." },
        { status: 400 }
      );
    }

    if (!mask) {
      return NextResponse.json(
        { error: "Please provide a mask for the area to edit." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Please enter a prompt description for the edit." },
        { status: 400 }
      );
    }

    // Build the image_request object
    const imageRequest: Record<string, unknown> = {
      prompt: prompt.trim(),
      model: "V_2",
      magic_prompt_option: magic_prompt_option || "OFF",
      num_images: num_images || 1,
    };

    // Only include optional fields if they have values
    if (aspect_ratio) {
      imageRequest.aspect_ratio = aspect_ratio;
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

    // Convert base64 to blob for the mask
    const maskBase64 = mask.replace(/^data:image\/\w+;base64,/, "");
    const maskBuffer = Buffer.from(maskBase64, "base64");
    const maskBlob = new Blob([maskBuffer], { type: "image/png" });

    // Build multipart form data
    const formData = new FormData();
    formData.append("image_request", JSON.stringify(imageRequest));
    formData.append("image_file", imageBlob, "image.png");
    formData.append("mask", maskBlob, "mask.png");

    console.log("Edit request:", { imageRequest, hasImageFile: true, hasMask: true });

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
      console.error("Edit API error:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Ideogram edit response:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Ideogram Edit API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to edit image. Please try again." },
      { status: 500 }
    );
  }
}
