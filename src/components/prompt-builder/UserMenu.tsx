"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function UserMenu() {
  const { user, profile, isLoading, isConfigured, signInWithGoogle, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#e0e0e0] dark:bg-[#3a3a3a] animate-pulse" />
    );
  }

  if (!isConfigured) {
    return (
      <div className="px-3 py-1.5 text-xs text-[#6b6b6b] dark:text-[#9a9a9a] bg-[#e0e0e0] dark:bg-[#3a3a3a] rounded-full">
        Local Mode
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={signInWithGoogle}
        className="flex items-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign In
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-[#998748]/10 transition-colors"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-[#998748]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#998748] to-[#d1c69e] flex items-center justify-center text-[#1A1A1A] font-medium text-sm">
            {(profile?.name || user.email || "U")[0].toUpperCase()}
          </div>
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#242424] rounded-xl shadow-xl border border-[#e0e0e0] dark:border-[#3a3a3a] overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 border-b border-[#e0e0e0] dark:border-[#3a3a3a]">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || "User"}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#998748] to-[#d1c69e] flex items-center justify-center text-[#1A1A1A] font-medium">
                  {(profile?.name || user.email || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1A1A1A] dark:text-[#f4f4f4] truncate">
                  {profile?.name || "User"}
                </p>
                <p className="text-sm text-[#6b6b6b] dark:text-[#9a9a9a] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setShowMenu(false);
                // Navigate to saved prompts
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#f4f4f4] dark:hover:bg-[#2e2e2e] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#998748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved Prompts
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                // Navigate to color schemes
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#f4f4f4] dark:hover:bg-[#2e2e2e] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#2589bd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Color Schemes
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                // Navigate to generation history
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#f4f4f4] dark:hover:bg-[#2e2e2e] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generation History
            </button>
          </div>

          {/* Sign Out */}
          <div className="p-2 border-t border-[#e0e0e0] dark:border-[#3a3a3a]">
            <button
              onClick={() => {
                setShowMenu(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
