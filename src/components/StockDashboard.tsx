"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import StockSearch from "./StockSearch";
import StockCard from "./StockCard";
import StockFilters from "./StockFilters";
import UpdateInterval from "./UpdateInterval";

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  lastUpdate?: number;
}

export default function StockDashboard() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customStocks");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [updateInterval, setUpdateInterval] = useState(60);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState(false);

  // Save custom symbols to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customStocks", JSON.stringify(customSymbols));
    }
  }, [customSymbols]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchStockData = useCallback(
    async (symbols?: string[]) => {
      try {
        const url = new URL("/api/stocks", window.location.origin);
        const symbolsToFetch = symbols || customSymbols;

        // Always fetch default stocks
        url.searchParams.set("limit", "20");

        // If we have custom symbols, add them to the request
        if (symbolsToFetch.length > 0) {
          url.searchParams.set("customSymbols", symbolsToFetch.join(","));
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }
        const data = await response.json();

        // Add lastUpdate timestamp to each stock
        const dataWithTimestamp = data.map((stock: StockData) => ({
          ...stock,
          lastUpdate: Date.now(),
        }));

        setStocks(dataWithTimestamp);
        setFilteredStocks(dataWithTimestamp);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        setError("Failed to load stock data. Please try again later.");
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    },
    [customSymbols]
  );

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    if (isAutoUpdateEnabled) {
      const interval = setInterval(() => {
        fetchStockData();
      }, updateInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [updateInterval, fetchStockData, isAutoUpdateEnabled]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStocks(stocks);
      return;
    }

    const filtered = stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const handleFilterChange = (filters: {
    sectors: string[];
    priceRange: { min: number; max: number };
    sortBy: string;
  }) => {
    let filtered = [...stocks];

    // Apply sector filter
    if (filters.sectors.length > 0) {
      filtered = filtered.filter((stock) =>
        filters.sectors.includes(stock.sector)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (stock) =>
        stock.price >= filters.priceRange.min &&
        stock.price <= filters.priceRange.max
    );

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "change":
          return b.change - a.change;
        case "volume":
          return b.volume - a.volume;
        case "marketCap":
          return b.marketCap - a.marketCap;
        default:
          return 0;
      }
    });

    setFilteredStocks(filtered);
  };

  const handleAddStock = async (symbol: string) => {
    if (!symbol) return;

    const formattedSymbol = symbol.toUpperCase() + ".NS";
    if (customSymbols.includes(formattedSymbol)) return;

    const newCustomSymbols = [...customSymbols, formattedSymbol];
    setCustomSymbols(newCustomSymbols);
    await fetchStockData(newCustomSymbols);

    // Clear search query to show all stocks
    setSearchQuery("");
  };

  const handleRemoveStock = async (symbol: string) => {
    const newCustomSymbols = customSymbols.filter((s) => s !== symbol);
    setCustomSymbols(newCustomSymbols);
    await fetchStockData(newCustomSymbols);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchStockData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleAutoUpdate = () => {
    setIsAutoUpdateEnabled(!isAutoUpdateEnabled);
  };

  // Get unique sectors from stocks
  const sectors = Array.from(new Set(stocks.map((stock) => stock.sector)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:flex-1">
          <StockSearch onSearch={handleSearch} onAddStock={handleAddStock} />
        </div>
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <button
            onClick={toggleAutoUpdate}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isAutoUpdateEnabled
                ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title={
              isAutoUpdateEnabled ? "Stop auto-update" : "Start auto-update"
            }
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isAutoUpdateEnabled ? "bg-white" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium whitespace-nowrap">
              {isAutoUpdateEnabled ? "Auto-update ON" : "Auto-update OFF"}
            </span>
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isRefreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Refresh stock data"
          >
            <ArrowPathIcon
              className={`h-5 w-5 text-gray-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
          <div className="w-full sm:w-auto">
            <UpdateInterval
              currentInterval={updateInterval}
              onIntervalChange={setUpdateInterval}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <StockFilters sectors={sectors} onFilterChange={handleFilterChange} />
        {isClient && (
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          No stocks found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onRemove={
                customSymbols.includes(stock.symbol)
                  ? () => handleRemoveStock(stock.symbol)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
