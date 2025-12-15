// ============================================
// ARCHIVO: /src/components/SearchBar.tsx
// ============================================
import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
      {inputValue && (
        <button onClick={() => setInputValue("")} className="clear-button">
          ✕
        </button>
      )}
    </div>
  );
};
