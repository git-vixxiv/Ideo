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

interface UserSettings {
  claude_api_key?: string;
  ideogram_api_key?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  settings: UserSettings | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
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

  // Fetch user settings (API keys, etc.)
  const fetchSettings = useCallback(async (userId: string) => {
    if (!isConfigured) return null;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_settings")
      .select("claude_api_key, ideogram_api_key")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error);
      return null;
    }

    return data as UserSettings | null;
  }, [isConfigured]);

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
        const [profileData, settingsData] = await Promise.all([
          fetchProfile(session.user.id),
          fetchSettings(session.user.id),
        ]);
        setProfile(profileData);
        setSettings(settingsData);
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
        const [profileData, settingsData] = await Promise.all([
          fetchProfile(session.user.id),
          fetchSettings(session.user.id),
        ]);
        setProfile(profileData);
        setSettings(settingsData);
      } else {
        setProfile(null);
        setSettings(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured, fetchProfile, fetchSettings]);

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
    setSettings(null);
  };

  // Update user settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!isConfigured || !user) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        ...settings,
        ...newSettings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error updating settings:", error);
      throw error;
    }

    setSettings((prev) => ({ ...prev, ...newSettings }));
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
        settings,
        isLoading,
        isConfigured,
        signInWithGoogle,
        signOut,
        updateSettings,
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
