"use client";

import { useEffect, useRef } from "react";
import { SearchBarProps } from "./SearchBar.interface";

export default function SearchBar({
  value,
  onChange,
  onDebouncedChange,
  delay = 400,
  placeholder = "Buscar...",
  className = "",
  name,
  autoFocus,
  ariaLabel,
}: SearchBarProps) {
  const latestCb = useRef(onDebouncedChange);
  const latestDelay = useRef(delay);

  useEffect(() => {
    latestCb.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    latestDelay.current = delay;
  }, [delay]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      latestCb.current?.(value);
    }, latestDelay.current);
    return () => window.clearTimeout(handler);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
  };

  return (
    <div className={`w-full relative ${className}`}>
      <input
        type="search"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pl-9 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400 dark:text-gray-500">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.03l3.76 3.76a.75.75 0 1 0 1.06-1.06l-3.76-3.76a6.75 6.75 0 0 0-5.26-10.97Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
        </svg>
      </span>
    </div>
  );
}
