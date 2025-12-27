"use client";

interface Option {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface OptionGridProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4 | 5;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OptionGrid({
  label,
  options,
  value,
  onChange,
  columns = 3,
  size = "md",
  className = "",
}: OptionGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-5",
  };

  const sizes = {
    sm: "p-2 text-xs",
    md: "p-3 text-sm",
    lg: "p-4 text-base",
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          {label}
        </label>
      )}
      <div className={`grid ${gridCols[columns]} gap-2`}>
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(isSelected ? "" : option.id)}
              className={`${sizes[size]} rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700"
              }`}
            >
              {option.icon && (
                <span className="text-xl mb-1 block">{option.icon}</span>
              )}
              <span
                className={`font-medium ${
                  isSelected
                    ? "text-violet-700 dark:text-violet-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {option.name}
              </span>
              {option.description && (
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 line-clamp-2">
                  {option.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
