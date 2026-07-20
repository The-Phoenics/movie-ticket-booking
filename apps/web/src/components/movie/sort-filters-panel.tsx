"use client";

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "A–Z" },
  { value: "newest", label: "Newest First" },
] as const;

export function SortFiltersPanel({
  sortBy,
  onChange,
}: {
  sortBy: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4 p-5 bg-white/3 border border-white/[0.07] rounded-xl flex flex-col gap-4 animate-[slideDown_0.2s_ease]">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
        <span className="text-xs font-semibold text-white/35 uppercase tracking-[0.08em] whitespace-nowrap pt-1.5 min-w-14">
          Sort by
        </span>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`py-[0.3rem] px-3 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 border ${
                sortBy === opt.value
                  ? "bg-[#dc2626]/20 border-[#dc2626]/50 text-[#fca5a5]"
                  : "bg-white/5 border-white/8 text-white/55 hover:text-[#fafafa] hover:border-white/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}