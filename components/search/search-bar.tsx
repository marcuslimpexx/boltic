"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchAutocomplete } from "./search-autocomplete";
import { searchProvider } from "@/lib/search";
import type { SearchResult } from "@/lib/search/provider";

const DEBOUNCE_MS = 200;

export function SearchBar() {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const runSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = searchProvider.search(q, 6);
    setResults(found);
    setIsOpen(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), DEBOUNCE_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder={t("placeholder")}
            value={query}
            onChange={handleChange}
            onFocus={() => { if (query.trim()) setIsOpen(true); }}
            className="pl-9 bg-background"
            aria-label={t("placeholder")}
            aria-expanded={isOpen}
            aria-autocomplete="list"
            autoComplete="off"
          />
        </div>
      </form>
      {isOpen && (
        <SearchAutocomplete
          results={results}
          query={query}
          onClose={handleClose}
          locale={locale}
        />
      )}
    </div>
  );
}
