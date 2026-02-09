import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { encrypt, decrypt } from "@/lib/encryption";

// GET - Retrieve whether API keys are set (not the actual keys)
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settings, error } = await supabase
      .from("user_settings")
      .select("claude_api_key, ideogram_api_key")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    // Return only whether keys are set, not the actual values
    return NextResponse.json({
      hasClaudeKey: !!settings?.claude_api_key,
      hasIdeogramKey: !!settings?.ideogram_api_key,
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Save encrypted API keys
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { claudeApiKey, ideogramApiKey } = body;

    // Validate API key formats (basic validation)
    if (claudeApiKey && !claudeApiKey.startsWith("sk-ant-")) {
      return NextResponse.json(
        { error: "Invalid Claude API key format" },
        { status: 400 }
      );
    }

    // Build update object with encrypted keys
    const updates: Record<string, string | null> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (claudeApiKey !== undefined) {
      updates.claude_api_key = claudeApiKey ? encrypt(claudeApiKey) : null;
    }

    if (ideogramApiKey !== undefined) {
      updates.ideogram_api_key = ideogramApiKey ? encrypt(ideogramApiKey) : null;
    }

    const { error } = await supabase.from("user_settings").upsert(updates);

    if (error) {
      console.error("Error saving settings:", error);
      return NextResponse.json(
        { error: "Failed to save settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hasClaudeKey: !!claudeApiKey,
      hasIdeogramKey: !!ideogramApiKey,
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Internal function to get decrypted API key (for use by other server routes)
export async function getDecryptedApiKey(
  userId: string,
  keyType: "claude" | "ideogram"
): Promise<string | null> {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("claude_api_key, ideogram_api_key")
    .eq("user_id", userId)
    .single();

  if (error || !settings) {
    return null;
  }

  const encryptedKey = keyType === "claude"
    ? settings.claude_api_key
    : settings.ideogram_api_key;

  if (!encryptedKey) {
    return null;
  }

  try {
    return decrypt(encryptedKey);
  } catch (err) {
    console.error("Failed to decrypt API key:", err);
    return null;
  }
}
