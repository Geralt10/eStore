import { useState, useMemo } from "react";

export function useProductFilter(products = []) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let result = products.filter((p) => {
      const titleMatch = p.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const descMatch = p.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return titleMatch || descMatch;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // Default: newest first
      result = [...result].reverse();
    }

    return result;
  }, [products, searchTerm, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    filteredProducts,
  };
}
