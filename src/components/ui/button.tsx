"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          // Variants
          {
            "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md shadow-primary/10":
              variant === "primary",
            "bg-secondary-light text-text-primary hover:bg-surface-active":
              variant === "secondary",
            "border border-border bg-surface text-text-primary hover:bg-surface-hover hover:border-border-hover":
              variant === "outline",
            "text-text-secondary hover:bg-surface-hover hover:text-text-primary":
              variant === "ghost",
            "bg-danger text-white hover:bg-danger/90 hover:shadow-md shadow-danger/10":
              variant === "danger",
          },
          // Sizes
          {
            "h-9 px-3.5 text-xs rounded-md": size === "sm",
            "h-11 px-5 text-sm": size === "md",
            "h-12 px-7 text-base rounded-xl": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
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
