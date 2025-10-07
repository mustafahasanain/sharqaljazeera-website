"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Max number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          scroll={false}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-body text-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 rounded-lg px-3 py-2 text-body text-dark-500 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </div>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-dark-500"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              scroll={false}
              className={`min-w-[40px] rounded-lg px-3 py-2 text-center text-body transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 ${
                currentPage === page
                  ? "bg-dark-900 text-light-100 font-medium"
                  : "text-dark-900 hover:bg-light-200"
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          scroll={false}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-body text-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <div className="flex items-center gap-1 rounded-lg px-3 py-2 text-body text-dark-500 cursor-not-allowed">
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
