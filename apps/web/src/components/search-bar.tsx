import { Search, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-0">
      <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-3 transition-[border-color,background] duration-200 focus-within:border-[#dc2626]/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]">
        <div className="text-white/30 flex shrink-0">
          <Search size={18} />
        </div>
        <input
          id="movies-search-input"
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-[#fafafa] text-[0.9375rem] [font-family:var(--body,'Archivo',sans-serif)] py-3.5 placeholder:text-white/25"
          placeholder='Search "The Quiet Hour", "Thriller", ...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        {search && (
          <button
            className="bg-transparent border-none text-white/35 cursor-pointer flex items-center p-1 rounded-full transition-colors duration-150 hover:text-[#fafafa] hover:bg-white/8"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* <button
        className={`flex items-center justify-center sm:justify-start gap-2 py-3.5 px-5 rounded-xl text-sm [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 whitespace-nowrap border ${
          showFilters
            ? "text-[#fafafa] border-[#dc2626]/40 bg-[#dc2626]/10"
            : "text-white/65 bg-white/5 border-white/10 hover:text-[#fafafa] hover:border-[#dc2626]/40 hover:bg-[#dc2626]/10"
        }`}
        onClick={() => setShowFilters((v) => !v)}
        aria-label="Toggle filters"
      >
        <Filter size={16} />
        Filters
      </button> */}
    </div>
  );
}
