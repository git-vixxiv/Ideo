"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createClient, isSupabaseConfigured } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// Only track whether keys are set, never the actual values
interface ApiKeyStatus {
  hasClaudeKey: boolean;
  hasIdeogramKey: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  apiKeyStatus: ApiKeyStatus;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveApiKeys: (claudeKey?: string, ideogramKey?: string) => Promise<void>;
  refreshApiKeyStatus: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>({
    hasClaudeKey: false,
    hasIdeogramKey: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isConfigured) return null;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as UserProfile;
  }, [isConfigured]);

  // Fetch API key status from secure endpoint (only returns booleans)
  const fetchApiKeyStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        return {
          hasClaudeKey: data.hasClaudeKey || false,
          hasIdeogramKey: data.hasIdeogramKey || false,
        };
      }
    } catch (error) {
      console.error("Error fetching API key status:", error);
    }
    return { hasClaudeKey: false, hasIdeogramKey: false };
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const [profileData, keyStatus] = await Promise.all([
          fetchProfile(session.user.id),
          fetchApiKeyStatus(),
        ]);
        setProfile(profileData);
        setApiKeyStatus(keyStatus);
      }

      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const [profileData, keyStatus] = await Promise.all([
          fetchProfile(session.user.id),
          fetchApiKeyStatus(),
        ]);
        setProfile(profileData);
        setApiKeyStatus(keyStatus);
      } else {
        setProfile(null);
        setApiKeyStatus({ hasClaudeKey: false, hasIdeogramKey: false });
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured, fetchProfile, fetchApiKeyStatus]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isConfigured) {
      console.error("Supabase is not configured");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isConfigured) return;

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      throw error;
    }

    setUser(null);
    setProfile(null);
    setSession(null);
    setApiKeyStatus({ hasClaudeKey: false, hasIdeogramKey: false });
  };

  // Save API keys securely via server endpoint
  const saveApiKeys = async (claudeKey?: string, ideogramKey?: string) => {
    if (!user) {
      throw new Error("Must be logged in to save API keys");
    }

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claudeApiKey: claudeKey,
        ideogramApiKey: ideogramKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save API keys");
    }

    const data = await response.json();
    setApiKeyStatus({
      hasClaudeKey: data.hasClaudeKey || false,
      hasIdeogramKey: data.hasIdeogramKey || false,
    });
  };

  // Refresh API key status
  const refreshApiKeyStatus = async () => {
    if (!user) return;
    const status = await fetchApiKeyStatus();
    setApiKeyStatus(status);
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) return;

    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        apiKeyStatus,
        isLoading,
        isConfigured,
        signInWithGoogle,
        signOut,
        saveApiKeys,
        refreshApiKeyStatus,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
