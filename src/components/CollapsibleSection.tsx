"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-light-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-body-medium text-dark-900 transition-colors hover:text-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-dark-700" />
        ) : (
          <ChevronDown size={20} className="text-dark-700" />
        )}
      </button>

      {isOpen && (
        <div className="pb-6 text-body text-dark-700 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
