"use client";

import { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";

interface StockCardProps {
  stock: {
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
  };
  onRemove?: () => void;
}

export default function StockCard({ stock, onRemove }: StockCardProps) {
  const [priceChange, setPriceChange] = useState<{
    value: number;
    isPositive: boolean;
  } | null>(null);
  const [previousPrice, setPreviousPrice] = useState(stock.price);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (previousPrice !== stock.price) {
      const change = stock.price - previousPrice;
      setPriceChange({
        value: Math.abs(change),
        isPositive: change > 0,
      });
      setPreviousPrice(stock.price);

      // Clear the price change animation after 3 seconds
      const timer = setTimeout(() => {
        setPriceChange(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stock.price, previousPrice]);

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive ? "bg-green-50" : "bg-red-50";

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {stock.symbol.replace(".NS", "")}
              </h3>
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {stock.sector}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{stock.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {onRemove && (
              <button
                onClick={onRemove}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove stock"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <div className={`px-2 py-1 rounded-full ${bgColor}`}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <div className="text-2xl font-bold text-gray-900">
              ₹{stock.price.toLocaleString()}
            </div>
            {priceChange && (
              <div
                className={`absolute -right-2 -top-2 px-2 py-1 rounded-full text-xs font-medium animate-fade-out ${
                  priceChange.isPositive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {priceChange.isPositive ? "+" : "-"}₹
                {priceChange.value.toFixed(2)}
              </div>
            )}
          </div>
          <div className={`mt-1 text-sm font-medium ${changeColor}`}>
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500">Volume</p>
            <p className="font-medium">{formatNumber(stock.volume)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500">Market Cap</p>
            <p className="font-medium">₹{formatNumber(stock.marketCap)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500">Day High</p>
            <p className="font-medium">₹{stock.dayHigh.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500">Day Low</p>
            <p className="font-medium">₹{stock.dayLow.toLocaleString()}</p>
          </div>
        </div>

        {isClient && stock.lastUpdate && (
          <div className="mt-4 flex items-center justify-end text-xs text-gray-500">
            <ClockIcon className="h-3 w-3 mr-1" />
            Updated: {new Date(stock.lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
