"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

export interface SizePickerProps {
  sizes: string[];
  availableSizes?: string[];
  onSizeChange?: (size: string) => void;
}

export default function SizePicker({
  sizes,
  availableSizes = sizes,
  onSizeChange,
}: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeClick = (size: string) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
      onSizeChange?.(size);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    size: string,
    index: number
  ) => {
    const isAvailable = availableSizes.includes(size);
    if (!isAvailable) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSizeClick(size);
    } else if (e.key === "ArrowRight") {
      const nextIndex = sizes.findIndex(
        (s, i) => i > index && availableSizes.includes(s)
      );
      if (nextIndex !== -1) {
        const nextElement = e.currentTarget.parentElement?.children[
          nextIndex
        ] as HTMLElement;
        nextElement?.focus();
      }
    } else if (e.key === "ArrowLeft") {
      const prevSizes = sizes.slice(0, index).reverse();
      const prevOffset = prevSizes.findIndex((s) =>
        availableSizes.includes(s)
      );
      if (prevOffset !== -1) {
        const prevIndex = index - prevOffset - 1;
        const prevElement = e.currentTarget.parentElement?.children[
          prevIndex
        ] as HTMLElement;
        prevElement?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-body-medium text-dark-900">Select Size</h3>
        <button className="flex items-center gap-1.5 text-caption text-dark-700 hover:text-dark-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 rounded px-1">
          <Ruler size={16} />
          <span>Size Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size, index) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              onKeyDown={(e) => handleKeyDown(e, size, index)}
              disabled={!isAvailable}
              className={`
                relative aspect-square rounded-lg border-2 text-body-medium transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700
                ${
                  isSelected
                    ? "border-dark-900 bg-dark-900 text-white"
                    : isAvailable
                      ? "border-light-300 bg-white text-dark-900 hover:border-dark-500"
                      : "border-light-300 bg-light-200 text-dark-500 cursor-not-allowed"
                }
              `}
              aria-label={`Size ${size}${!isAvailable ? " - unavailable" : ""}${isSelected ? " - selected" : ""}`}
              aria-disabled={!isAvailable}
              tabIndex={isAvailable ? 0 : -1}
            >
              {size}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-px w-full rotate-45 bg-dark-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
