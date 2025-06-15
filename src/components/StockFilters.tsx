"use client";

import { useState, useEffect } from "react";

interface StockFiltersProps {
  sectors: string[];
  onFilterChange: (filters: {
    sectors: string[];
    priceRange: { min: number; max: number };
    sortBy: string;
  }) => void;
}

export default function StockFilters({
  sectors,
  onFilterChange,
}: StockFiltersProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("name");
  const [isOpen, setIsOpen] = useState(false);

  // Sort sectors alphabetically and remove duplicates
  const uniqueSectors = Array.from(new Set(sectors)).sort();

  useEffect(() => {
    onFilterChange({
      sectors: selectedSectors,
      priceRange,
      sortBy,
    });
  }, [selectedSectors, priceRange, sortBy, onFilterChange]);

  const handleSectorChange = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const handlePriceRangeChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    setPriceRange((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Sector Filter */}
        <div className="relative w-full sm:flex-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-sm font-medium text-gray-700">
              {selectedSectors.length > 0
                ? `${selectedSectors.length} sectors selected`
                : "All Sectors"}
            </span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              <div className="py-1">
                {uniqueSectors.map((sector) => (
                  <label
                    key={sector}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={() => handleSectorChange(sector)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{sector}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="flex items-center gap-2 w-full sm:flex-1">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange("min", e.target.value)}
            placeholder="Min Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange("max", e.target.value)}
            placeholder="Max Price"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort Options */}
        <div className="w-full sm:flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
            <option value="volume">Volume</option>
            <option value="marketCap">Market Cap</option>
          </select>
        </div>
      </div>
    </div>
  );
}
