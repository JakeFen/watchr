"use client";

import type { ChipProps } from "../types/chip";

export function Chip<T extends string>({ options, value, onChange }: ChipProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-zinc-800 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            option.value === value
              ? "bg-zinc-100 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
