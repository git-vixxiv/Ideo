"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import type { PromptBuilderState, PromptHistoryItem } from "@/types/prompt";
import { DEFAULT_PROMPT_STATE } from "./constants";
import { buildPrompt, generateNegativePrompt } from "./prompt-builder";

interface PromptContextValue {
  state: PromptBuilderState;
  generatedPrompt: string;
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
  apiKeys: {
    claude: string;
    ideogram: string;
  };
  setApiKey: (key: "claude" | "ideogram", value: string) => void;
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
  const [state, dispatch] = useReducer(promptReducer, DEFAULT_PROMPT_STATE);
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
          return [action.item, ...state].slice(0, 50); // Keep last 50 items
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

  const [apiKeys, setApiKeys] = useReducer(
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

  // Load from localStorage on mount
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
          setApiKeys({ type: "LOAD", keys: JSON.parse(savedKeys) });
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

  // Save API keys to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && (apiKeys.claude || apiKeys.ideogram)) {
      localStorage.setItem("ideogram-api-keys", JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

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

  const setApiKey = useCallback((key: "claude" | "ideogram", value: string) => {
    setApiKeys({ type: "SET", key, value });
  }, []);

  return (
    <PromptContext.Provider
      value={{
        state,
        generatedPrompt,
        updateState,
        resetState,
        loadState,
        history,
        addToHistory,
        toggleFavorite,
        clearHistory,
        apiKeys,
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
