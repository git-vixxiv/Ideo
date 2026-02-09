import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { decrypt } from "@/lib/encryption";

export async function getClaudeApiKey(request: NextRequest): Promise<string | null> {
  return getApiKey(request, "claude");
}

export async function getIdeogramApiKey(request: NextRequest): Promise<string | null> {
  return getApiKey(request, "ideogram");
}

async function getApiKey(
  request: NextRequest,
  keyType: "claude" | "ideogram"
): Promise<string | null> {
  const headerKey = keyType === "claude" ? "x-api-key" : "x-ideogram-key";

  // First, try to get the key from the authenticated user's stored settings
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("claude_api_key, ideogram_api_key")
        .eq("user_id", user.id)
        .single();

      const encryptedKey = keyType === "claude"
        ? settings?.claude_api_key
        : settings?.ideogram_api_key;

      if (encryptedKey) {
        try {
          return decrypt(encryptedKey);
        } catch {
          // Key might not be encrypted (legacy), try using it directly
          return encryptedKey;
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching user ${keyType} API key:`, error);
  }

  // Fallback to header for local mode (non-authenticated users)
  return request.headers.get(headerKey);
}
