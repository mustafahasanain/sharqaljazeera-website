"use client";

import { Check } from "lucide-react";

export interface ColorSwatchesProps {
  variants: Array<{ color: string; images: string[] }>;
  selectedIndex: number;
  onSelectVariant: (index: number) => void;
}

export default function ColorSwatches({
  variants,
  selectedIndex,
  onSelectVariant,
}: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant, index) => {
        const hasValidImage =
          variant.images && variant.images.filter(Boolean).length > 0;
        if (!hasValidImage) return null;

        const isSelected = selectedIndex === index;

        return (
          <button
            key={index}
            onClick={() => onSelectVariant(index)}
            className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 ${
              isSelected
                ? "border-dark-900 ring-2 ring-dark-900 ring-offset-2"
                : "border-light-300 hover:border-dark-500"
            }`}
            aria-label={`Select ${variant.color} variant${isSelected ? " - selected" : ""}`}
            aria-pressed={isSelected}
          >
            <img
              src={variant.images[0]}
              alt={variant.color}
              className="h-full w-full object-cover"
            />
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-900/30">
                <div className="rounded-full bg-white p-0.5">
                  <Check size={14} className="text-dark-900" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
