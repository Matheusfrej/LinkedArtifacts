"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

import { useState } from "react";

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const [input, setInput] = useState(value);

  // Keep local input in sync if parent resets value
  // (optional, can be omitted if not needed)
  // useEffect(() => { setInput(value); }, [value]);

  const handleSearch = () => {
    onChange(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center mb-8 gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Search..."}
        className="w-full max-w-xl px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-800 dark:text-gray-100"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        aria-label="Search papers"
      >
        Search
      </button>
    </div>
  );
}
