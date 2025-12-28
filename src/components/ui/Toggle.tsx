"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className = "", label, description, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label
        className={`flex items-start gap-3 cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors duration-200 ${
              checked
                ? "bg-[#998748]"
                : "bg-zinc-200 dark:bg-[#3a3a3a]"
            }`}
          />
          <div
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";
