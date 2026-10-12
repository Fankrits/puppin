import React from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "../../lib/utils/cn";

export interface ButtonProps extends AriaButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isDisabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-puppin data-[pressed]:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 rounded-full min-h-[44px]";

    const variantStyles = {
      primary: "bg-puppin hover:bg-puppin-deep text-white",
      secondary: "bg-paper hover:bg-mist text-ink border-2 border-line hover:border-ink",
      tertiary: "bg-transparent hover:bg-mist text-ink",
      destructive: "bg-puppin-deep hover:bg-[#962318] text-white",
      outline: "bg-transparent hover:bg-mist text-ink border-2 border-ink",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm gap-1.5 min-h-[38px]",
      md: "px-5 py-2.5 text-sm gap-2 min-h-[44px]",
      lg: "px-6 py-3 text-base gap-2 min-h-[50px]",
      xl: "px-7 py-3.5 text-lg gap-2.5 min-h-[56px]",
    };

    return (
      <AriaButton
        ref={ref}
        isDisabled={isDisabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      </AriaButton>
    );
  },
);

Button.displayName = "Button";
