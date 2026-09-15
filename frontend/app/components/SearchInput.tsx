"use client";

import { useState, type KeyboardEvent } from "react";

export function SearchInput({
  initialValue = "",
  onSubmit,
  className = "",
}: {
  initialValue?: string;
  onSubmit: (value: string) => void;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }

  return (
    <input
      type="search"
      placeholder="Search films or users"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      className={`rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${className}`}
    />
  );
}
