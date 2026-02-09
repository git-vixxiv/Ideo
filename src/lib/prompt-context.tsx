"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import type { PromptBuilderState, PromptHistoryItem } from "@/types/prompt";
import { DEFAULT_PROMPT_STATE } from "./constants";
import { buildPrompt } from "./prompt-builder";
import { useAuth } from "./auth-context";

interface PromptContextValue {
  state: PromptBuilderState;
  generatedPrompt: string;
  optimizedPrompt: string | null;
  setOptimizedPrompt: (prompt: string | null) => void;
  updateState: <K extends keyof PromptBuilderState>(
    key: K,
    value: PromptBuilderState[K]
  ) => void;
  resetState: () => void;
  loadState: (state: PromptBuilderState) => void;
  history: PromptHistoryItem[];
  addToHistory: (item: Omit<PromptHistoryItem, "id" | "timestamp">) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  // For logged-in users: indicates if keys are stored server-side
  // For local mode: contains the actual keys from localStorage
  apiKeys: {
    claude: string;
    ideogram: string;
  };
  // Indicates whether API keys are available (either server-side or local)
  hasApiKeys: {
    claude: boolean;
    ideogram: boolean;
  };
  setApiKey: (key: "claude" | "ideogram", value: string) => Promise<void>;
}

const PromptContext = createContext<PromptContextValue | null>(null);

type Action =
  | { type: "UPDATE"; key: keyof PromptBuilderState; value: unknown }
  | { type: "RESET" }
  | { type: "LOAD"; state: PromptBuilderState };

function promptReducer(
  state: PromptBuilderState,
  action: Action
): PromptBuilderState {
  switch (action.type) {
    case "UPDATE":
      return { ...state, [action.key]: action.value };
    case "RESET":
      return { ...DEFAULT_PROMPT_STATE };
    case "LOAD":
      return { ...action.state };
    default:
      return state;
  }
}

interface PromptProviderProps {
  children: ReactNode;
}

export function PromptProvider({ children }: PromptProviderProps) {
  const { user, apiKeyStatus, saveApiKeys } = useAuth();
  const [state, dispatch] = useReducer(promptReducer, DEFAULT_PROMPT_STATE);
  const [optimizedPrompt, setOptimizedPromptState] = useState<string | null>(null);
  const [history, setHistory] = useReducer(
    (
      state: PromptHistoryItem[],
      action:
        | { type: "ADD"; item: PromptHistoryItem }
        | { type: "TOGGLE_FAVORITE"; id: string }
        | { type: "CLEAR" }
        | { type: "LOAD"; items: PromptHistoryItem[] }
    ) => {
      switch (action.type) {
        case "ADD":
          return [action.item, ...state].slice(0, 50);
        case "TOGGLE_FAVORITE":
          return state.map((item) =>
            item.id === action.id
              ? { ...item, isFavorite: !item.isFavorite }
              : item
          );
        case "CLEAR":
          return state.filter((item) => item.isFavorite);
        case "LOAD":
          return action.items;
        default:
          return state;
      }
    },
    []
  );

  // Local API keys for non-authenticated users only
  const [localApiKeys, setLocalApiKeys] = useReducer(
    (
      state: { claude: string; ideogram: string },
      action: { type: "SET"; key: "claude" | "ideogram"; value: string } | { type: "LOAD"; keys: { claude: string; ideogram: string } }
    ) => {
      if (action.type === "LOAD") {
        return action.keys;
      }
      return { ...state, [action.key]: action.value };
    },
    { claude: "", ideogram: "" }
  );

  // For logged-in users, we don't expose actual keys - server handles them
  // For local mode, we use localStorage keys
  const apiKeys = user
    ? { claude: "", ideogram: "" }  // Never expose actual keys for logged-in users
    : localApiKeys;

  // Track whether keys are available
  const hasApiKeys = {
    claude: user ? apiKeyStatus.hasClaudeKey : !!localApiKeys.claude,
    ideogram: user ? apiKeyStatus.hasIdeogramKey : !!localApiKeys.ideogram,
  };

  // Load from localStorage on mount (for local mode only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("ideogram-prompt-history");
      const savedKeys = localStorage.getItem("ideogram-api-keys");

      if (savedHistory) {
        try {
          setHistory({ type: "LOAD", items: JSON.parse(savedHistory) });
        } catch (e) {
          console.error("Failed to load history:", e);
        }
      }

      if (savedKeys) {
        try {
          setLocalApiKeys({ type: "LOAD", keys: JSON.parse(savedKeys) });
        } catch (e) {
          console.error("Failed to load API keys:", e);
        }
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      localStorage.setItem("ideogram-prompt-history", JSON.stringify(history));
    }
  }, [history]);

  // Save API keys to localStorage only when not logged in
  useEffect(() => {
    if (typeof window !== "undefined" && !user && (localApiKeys.claude || localApiKeys.ideogram)) {
      localStorage.setItem("ideogram-api-keys", JSON.stringify(localApiKeys));
    }
  }, [localApiKeys, user]);

  const updateState = useCallback(
    <K extends keyof PromptBuilderState>(
      key: K,
      value: PromptBuilderState[K]
    ) => {
      dispatch({ type: "UPDATE", key, value });
    },
    []
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const loadState = useCallback((newState: PromptBuilderState) => {
    dispatch({ type: "LOAD", state: newState });
  }, []);

  const generatedPrompt = buildPrompt(state);

  const addToHistory = useCallback(
    (item: Omit<PromptHistoryItem, "id" | "timestamp">) => {
      setHistory({
        type: "ADD",
        item: {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      });
    },
    []
  );

  const toggleFavorite = useCallback((id: string) => {
    setHistory({ type: "TOGGLE_FAVORITE", id });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory({ type: "CLEAR" });
    localStorage.removeItem("ideogram-prompt-history");
  }, []);

  const setApiKey = useCallback(async (key: "claude" | "ideogram", value: string) => {
    if (user) {
      // For logged-in users, save securely via server
      await saveApiKeys(
        key === "claude" ? value : undefined,
        key === "ideogram" ? value : undefined
      );
    } else {
      // For local mode, save to localStorage
      setLocalApiKeys({ type: "SET", key, value });
    }
  }, [user, saveApiKeys]);

  const setOptimizedPrompt = useCallback((prompt: string | null) => {
    setOptimizedPromptState(prompt);
  }, []);

  // Clear optimized prompt when key state fields change
  useEffect(() => {
    setOptimizedPromptState(null);
  }, [state.subject, state.artStyle, state.setting]);

  return (
    <PromptContext.Provider
      value={{
        state,
        generatedPrompt,
        optimizedPrompt,
        setOptimizedPrompt,
        updateState,
        resetState,
        loadState,
        history,
        addToHistory,
        toggleFavorite,
        clearHistory,
        apiKeys,
        hasApiKeys,
        setApiKey,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

export function usePromptContext() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }
  return context;
}
