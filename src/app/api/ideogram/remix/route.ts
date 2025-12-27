import { NextRequest, NextResponse } from "next/server";

const IDEOGRAM_API_URL = "https://api.ideogram.ai/v1/ideogram-v3/remix";

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Ideogram API key is required. Please add your API key in settings." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Forward the form data to Ideogram API
    const response = await fetch(IDEOGRAM_API_URL, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
      },
      body: formData,
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
    console.error("Ideogram Remix API error:", error);
    return NextResponse.json(
      { error: "Failed to remix image. Please try again." },
      { status: 500 }
    );
  }
}
