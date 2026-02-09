import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { decrypt } from "@/lib/encryption";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are an expert Ideogram prompt engineer. Your role is to help users create the most effective prompts for generating images with Ideogram AI.

## Key Ideogram Prompt Best Practices:

1. **Structure**: Write prompts like a creative brief - subject first, then style, then constraints
2. **Text in Images**: Always wrap exact text in double quotes: "Your Text Here"
3. **Keep it Focused**: One subject, one primary style. Avoid mixing conflicting styles.
4. **Specificity**: Use precise descriptive terms rather than vague words like "cool" or "nice"
5. **Background Control**: Explicitly specify background (e.g., "transparent background", "white background", "solid pastel background")
6. **Text Placement**: Pin text position with terms like "centered", "top arc", "bottom footer"
7. **Typography Hints**: Use terms like "generous margins", "wide tracking", "loose kerning" for text spacing
8. **Color Control**: Specify color palette explicitly when needed
9. **Keep Text Short**: Long text has higher error rates - short, punchy phrases work best
10. **Aspect Ratio Context**: Consider how the aspect ratio affects composition

## Your Tasks:
1. Analyze the user's intent and current prompt
2. Optimize the prompt following best practices
3. Suggest appropriate negative prompts
4. Explain your improvements
5. Offer additional suggestions if relevant

Be concise but thorough. Focus on practical improvements that will yield better results.`;

async function getApiKey(request: NextRequest): Promise<string | null> {
  // First, try to get the key from the authenticated user's stored settings
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("claude_api_key")
        .eq("user_id", user.id)
        .single();

      if (settings?.claude_api_key) {
        try {
          return decrypt(settings.claude_api_key);
        } catch {
          // Key might not be encrypted (legacy), try using it directly
          return settings.claude_api_key;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user API key:", error);
  }

  // Fallback to header for local mode (non-authenticated users)
  return request.headers.get("x-api-key");
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = await getApiKey(request);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Claude API key is required. Please add your API key in settings." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPrompt, state, feedback, action = "optimize" } = body;

    let userMessage = "";

    if (action === "optimize") {
      userMessage = `Please optimize this Ideogram prompt:

**Current Prompt:** ${currentPrompt || "(empty)"}

**User's Intent:**
- Subject Category: ${state?.subjectCategory || "Not specified"}
- Subject: ${state?.subject || "Not specified"}
- Art Style: ${state?.artStyle || "Not specified"}
- Mood: ${state?.mood || "Not specified"}
- Contains Text: ${state?.textContent ? `Yes - "${state.textContent}"` : "No"}
- Aspect Ratio: ${state?.aspectRatio || "1:1"}
- Additional Details: ${state?.additionalDetails || "None"}

${feedback ? `**User Feedback:** ${feedback}` : ""}

Please provide:
1. An optimized prompt that follows Ideogram best practices
2. A suggested negative prompt
3. A brief explanation of your improvements
4. Any additional suggestions for better results

Format your response as JSON:
{
  "optimizedPrompt": "your optimized prompt here",
  "negativePrompt": "suggested negative prompt",
  "explanation": "brief explanation of changes",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
    } else if (action === "describe") {
      userMessage = `Based on this description, create an ideal Ideogram prompt:

"${body.description}"

Consider what the user likely wants and create a well-structured prompt following Ideogram best practices.

Format your response as JSON:
{
  "optimizedPrompt": "your crafted prompt here",
  "negativePrompt": "suggested negative prompt",
  "explanation": "brief explanation of your prompt structure",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
    } else if (action === "improve") {
      userMessage = `The user generated an image with this prompt but wants to improve it:

**Prompt Used:** ${currentPrompt}
**User Feedback:** ${feedback}

Suggest an improved prompt based on their feedback.

Format your response as JSON:
{
  "optimizedPrompt": "your improved prompt here",
  "negativePrompt": "suggested negative prompt",
  "explanation": "brief explanation of changes",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || `Claude API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || "";

    // Try to parse JSON from the response
    try {
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // If JSON parsing fails, return the raw text
    }

    return NextResponse.json({
      optimizedPrompt: assistantMessage,
      negativePrompt: "",
      explanation: "Response could not be parsed as structured data.",
      suggestions: [],
    });
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Claude API. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
