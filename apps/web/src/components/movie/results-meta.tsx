"use client";

import { X } from "lucide-react";

export function ResultsMeta({
  count,
  hasActiveFilters,
  onClear,
}: {
  count: number;
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-sm text-white/40">
        {count} {count === 1 ? "film" : "films"} found
      </span>
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-[0.8125rem] text-[#f87171] bg-transparent border-none cursor-pointer py-1 px-2 rounded-md transition-colors duration-150 [font-family:var(--body,'Archivo',sans-serif)] hover:bg-[#dc2626]/10"
        >
          <X size={12} />
          Clear filters
        </button>
      )}
    </div>
  );
}
