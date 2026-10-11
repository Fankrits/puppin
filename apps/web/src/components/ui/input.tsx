import React from "react";
import {
  TextField as AriaTextField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import { cn } from "../../lib/utils/cn";

export interface InputProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      errorMessage,
      placeholder,
      className,
      inputClassName,
      isInvalid,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    return (
      <AriaTextField
        isInvalid={isInvalid || Boolean(errorMessage)}
        isDisabled={isDisabled}
        className={cn("flex flex-col gap-1.5 w-full", className)}
        {...props}
      >
        {label && <AriaLabel className="text-sm font-medium text-neutral-700">{label}</AriaLabel>}
        <div className="relative">
          <AriaInput
            ref={ref}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-xs transition-colors placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed",
              (isInvalid || errorMessage) &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
              inputClassName,
            )}
          />
        </div>
        {description && (
          <AriaText slot="description" className="text-xs text-neutral-500">
            {description}
          </AriaText>
        )}
        {errorMessage && (
          <AriaText slot="errorMessage" className="text-xs text-red-600">
            {errorMessage}
          </AriaText>
        )}
      </AriaTextField>
    );
  },
);

Input.displayName = "Input";
