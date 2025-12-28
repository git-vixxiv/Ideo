"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // iddy brand colors
    const variants = {
      primary: "bg-gradient-to-r from-[#998748] to-[#d1c69e] text-[#1A1A1A] hover:shadow-lg hover:shadow-[#998748]/30 focus:ring-[#998748]",
      secondary: "bg-[#f4f4f4] dark:bg-[#242424] text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#e8e8e8] dark:hover:bg-[#2e2e2e] focus:ring-[#998748] border border-[#e0e0e0] dark:border-[#3a3a3a]",
      ghost: "text-[#1A1A1A] dark:text-[#f4f4f4] hover:bg-[#f4f4f4] dark:hover:bg-[#242424] focus:ring-[#998748]",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      accent: "bg-[#2589bd] text-white hover:bg-[#1e7aa8] hover:shadow-lg hover:shadow-[#2589bd]/30 focus:ring-[#2589bd]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
