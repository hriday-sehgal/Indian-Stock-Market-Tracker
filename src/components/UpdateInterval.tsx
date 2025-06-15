"use client";

import { useState, useEffect, useRef } from "react";
import { ClockIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface UpdateIntervalProps {
  onIntervalChange: (interval: number) => void;
  currentInterval: number;
}

export default function UpdateInterval({
  onIntervalChange,
  currentInterval,
}: UpdateIntervalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInterval, setCustomInterval] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [previewInterval, setPreviewInterval] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const intervals = [
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "2 minutes", value: 120 },
    { label: "5 minutes", value: 300 },
    { label: "10 minutes", value: 600 },
    { label: "Custom...", value: -1 },
  ];

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds === 60) return "1 minute";
    if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
    return `${(seconds / 3600).toFixed(2)} hours`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowCustomInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update preview when custom interval changes
  useEffect(() => {
    const seconds = parseInt(customInterval);
    if (!isNaN(seconds) && seconds >= 3) {
      setPreviewInterval(formatInterval(seconds));
    } else {
      setPreviewInterval("");
    }
  }, [customInterval]);

  const handleCustomIntervalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seconds = parseInt(customInterval);
    if (seconds >= 3) {
      onIntervalChange(seconds);
      setShowCustomInput(false);
      setCustomInterval("");
      setIsOpen(false);
    }
  };

  const handleCloseCustomInput = () => {
    setShowCustomInput(false);
    setCustomInterval("");
    setPreviewInterval("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setShowCustomInput(false);
    }
  };

  const renderContent = () => (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Update Interval</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-500 transition-colors p-1"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {!showCustomInput ? (
        <>
          <div className="text-xs font-medium text-gray-500 mb-2">
            Preset Intervals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {intervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => {
                  if (interval.value === -1) {
                    setShowCustomInput(true);
                  } else {
                    onIntervalChange(interval.value);
                    setIsOpen(false);
                  }
                }}
                className={`group flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                  currentInterval === interval.value
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{interval.label}</span>
                {currentInterval === interval.value && (
                  <CheckIcon className="h-5 w-5 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Custom Interval
            </h3>
            <button
              onClick={handleCloseCustomInput}
              className="text-gray-400 hover:text-gray-500 transition-colors p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleCustomIntervalSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="number"
                value={customInterval}
                onChange={(e) => setCustomInterval(e.target.value)}
                placeholder="Enter seconds"
                min="3"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                seconds
              </div>
            </div>
            {previewInterval && (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                Preview: {previewInterval}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!previewInterval}
                className="flex-1 px-4 py-3 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Set Interval
              </button>
            </div>
            <p className="text-sm text-gray-500">Minimum 3 seconds required</p>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-full sm:w-auto"
      >
        <ClockIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-700 truncate">
          Update: {formatInterval(currentInterval)}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Mobile Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998] sm:hidden"
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Mobile Modal */}
          <div
            className="fixed sm:hidden z-[9999] w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {renderContent()}
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden sm:block absolute z-50 mt-2 w-80 right-0 bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
            {renderContent()}
          </div>
        </>
      )}
    </div>
  );
}
