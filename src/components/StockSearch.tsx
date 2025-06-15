"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

interface StockSearchProps {
  onSearch: (query: string) => void;
  onAddStock: (symbol: string) => void;
}

export default function StockSearch({
  onSearch,
  onAddStock,
}: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ symbol: string; name: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customSymbol, setCustomSymbol] = useState("");

  // Common Indian stock symbols and names for suggestions in search bar
  const commonStocks = [
    { symbol: "RELIANCE", name: "Reliance Industries" },
    { symbol: "TCS", name: "Tata Consultancy Services" },
    { symbol: "HDFCBANK", name: "HDFC Bank" },
    { symbol: "INFY", name: "Infosys" },
    { symbol: "ICICIBANK", name: "ICICI Bank" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever" },
    { symbol: "SBIN", name: "State Bank of India" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel" },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank" },
    { symbol: "BAJFINANCE", name: "Bajaj Finance" },
    { symbol: "WIPRO", name: "Wipro" },
    { symbol: "TITAN", name: "Titan Company" },
    { symbol: "ASIANPAINT", name: "Asian Paints" },
    { symbol: "NESTLEIND", name: "Nestle India" },
    { symbol: "MARUTI", name: "Maruti Suzuki" },
    { symbol: "TATAMOTORS", name: "Tata Motors" },
    { symbol: "ONGC", name: "Oil and Natural Gas Corporation" },
    { symbol: "POWERGRID", name: "Power Grid Corporation" },
    { symbol: "NTPC", name: "NTPC" },
    { symbol: "ITC", name: "ITC" },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = commonStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleAddCustomStock = () => {
    if (customSymbol.trim()) {
      onAddStock(customSymbol.trim());
      setCustomSymbol("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSearch(stock.symbol)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <div className="font-medium text-gray-900">{stock.symbol}</div>
              <div className="text-sm text-gray-500">{stock.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Add Custom Stock */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add custom stock symbol..."
          value={customSymbol}
          onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAddCustomStock}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add
        </button>
      </div>
    </div>
  );
}
