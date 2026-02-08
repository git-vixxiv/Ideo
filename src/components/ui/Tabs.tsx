"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, value, onValueChange, children, className = "", onChange }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(value || defaultValue || "");

  // Sync with external value if controlled
  useEffect(() => {
    if (value !== undefined) {
      setInternalActiveTab(value);
    }
  }, [value]);

  const activeTab = value !== undefined ? value : internalActiveTab;

  const handleSetActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalActiveTab(newValue);
    }
    onValueChange?.(newValue);
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div
      className={`flex gap-1 p-1 bg-[#f4f4f4] dark:bg-[#1A1A1A] rounded-lg ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        isActive
          ? "bg-white dark:bg-[#242424] text-[#1A1A1A] dark:text-[#f4f4f4] shadow-sm border-b-2 border-[#998748]"
          : "text-[#6b6b6b] dark:text-[#9a9a9a] hover:text-[#1A1A1A] dark:hover:text-[#f4f4f4]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div role="tabpanel" className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
