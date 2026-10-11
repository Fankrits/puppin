import type { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

/** Pill radio used for variant and option pickers. */
export function OptionChip({
  name,
  value,
  checked,
  unavailable = false,
  onSelect,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  /** No variant exists with this value given the other choices; still selectable. */
  unavailable?: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "min-h-11 min-w-11 inline-flex items-center justify-center rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-puppin",
        checked
          ? "border-ink bg-ink text-white"
          : unavailable
            ? "cursor-pointer border-dashed border-line text-ink-soft line-through decoration-1 hover:border-ink-soft"
            : "cursor-pointer border-line text-ink hover:border-ink",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      {children}
    </label>
  );
}
