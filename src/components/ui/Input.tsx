"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-white dark:bg-[#242424] border border-zinc-200 dark:border-[#3a3a3a] rounded-lg text-[#1A1A1A] dark:text-[#f4f4f4] placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#998748] focus:border-transparent transition-all duration-200 ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{hint}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
