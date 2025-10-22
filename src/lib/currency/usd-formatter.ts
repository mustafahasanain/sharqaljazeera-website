export type UsdFormatOptions = {
  readonly locale?: "en-US" | string;
  readonly useGrouping?: boolean; // Use thousand separators (default: true)
  readonly currencyDisplay?: "symbol" | "code" | "name"; // How to display currency (default: 'symbol' = '$')
  readonly minimumFractionDigits?: number; // default: 2
  readonly maximumFractionDigits?: number; // default: 2
};

// Result of formatting operation
export type FormattedCurrency = {
  readonly value: string; // Formatted string (e.g., "$1,500.00")
  readonly numericValue: number; // Original numeric value
  readonly currency: "USD";
  readonly locale: string;
};

/**
 * Format a number as US Dollar (USD) currency
 *
 * USD is the official currency of the United States.
 * All numbers are formatted using Western numerals (0-9).
 * By default, uses the dollar sign "$" symbol.
 *
 * @param amount - Number to format as USD
 * @param options - Formatting options
 * @returns Formatted currency string with Western numerals
 *
 * @example
 * formatUSD(1500.50)
 * // Returns: "$1,500.50"
 *
 * @example
 * formatUSD(1500.5, { currencyDisplay: 'code' })
 * // Returns: "USD 1,500.50"
 */
export function formatUSD(
  amount: number,
  options: UsdFormatOptions = {}
): string {
  const {
    locale = "en-US",
    useGrouping = true,
    currencyDisplay = "symbol",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Always use en-US for number formatting to ensure Western numerals
  const numericLocale = "en-US";

  // Format the number
  const formatted = new Intl.NumberFormat(numericLocale, {
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  // Use $ symbol by default, or code if specified
  if (currencyDisplay === "symbol") {
    return `$${formatted}`;
  } else if (currencyDisplay === "code") {
    return `USD ${formatted}`;
  } else if (currencyDisplay === "name") {
    return `${formatted} US Dollar`;
  }

  // Default to symbol
  return `$${formatted}`;
}

/**
 * Format a number as USD with full metadata
 * All numbers are formatted using Western numerals (0-9).
 *
 * @param amount - Number to format as USD
 * @param options - Formatting options
 * @returns Formatted currency object with metadata
 *
 * @example
 * formatUSDWithMeta(1500.50)
 * // Returns: { value: "$1,500.50", numericValue: 1500.50, currency: 'USD', locale: 'en-US' }
 */
export function formatUSDWithMeta(
  amount: number,
  options: UsdFormatOptions = {}
): FormattedCurrency {
  const locale = options.locale || "en-US";

  return {
    value: formatUSD(amount, options),
    numericValue: amount,
    currency: "USD",
    locale,
  };
}

/**
 * Parse a formatted USD string back to a number
 * Handles English numerals and formats
 *
 * @param formattedValue - Formatted USD string
 * @returns Numeric value, or null if parsing fails
 *
 * @example
 * parseUSD("$1,500.50")
 * // Returns: 1500.50
 *
 * @example
 * parseUSD("USD 1,500.50")
 * // Returns: 1500.50
 */
export function parseUSD(formattedValue: string): number | null {
  if (!formattedValue || typeof formattedValue !== "string") {
    return null;
  }

  // Remove currency symbols and separators
  // Remove: USD, $, spaces, commas
  const normalized = formattedValue.replace(/USD|[$,\s]/g, "").trim();

  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Format USD amount in shortened form (e.g., $1.5K, $500)
 * Useful for displaying large amounts in compact spaces
 * All numbers are formatted using Western numerals (0-9).
 * Uses the dollar sign "$" by default.
 *
 * @param amount - Number to format
 * @param useSymbol - Whether to use symbol ($) or code (USD), default: true
 * @returns Shortened formatted string with Western numerals
 *
 * @example
 * formatUSDCompact(1500.50)
 * // Returns: "$1.5K"
 *
 * @example
 * formatUSDCompact(750.25)
 * // Returns: "$750.25"
 *
 * @example
 * formatUSDCompact(1500.50, false)
 * // Returns: "USD 1.5K"
 */
export function formatUSDCompact(
  amount: number,
  useSymbol: boolean = true
): string {
  const currencySymbol = useSymbol ? "$" : "USD";
  const numericLocale = "en-US";

  // Use compact notation if available (requires modern browsers/Node)
  try {
    const formatted = new Intl.NumberFormat(numericLocale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(amount);

    // Symbol always before number for USD
    return `${currencySymbol}${formatted}`;
  } catch (error) {
    // Fallback for older environments
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";

    let value: string;
    if (absAmount >= 1_000_000_000) {
      value = (amount / 1_000_000_000).toFixed(1) + "B";
    } else if (absAmount >= 1_000_000) {
      value = (amount / 1_000_000).toFixed(1) + "M";
    } else if (absAmount >= 1_000) {
      value = (amount / 1_000).toFixed(1) + "K";
    } else {
      return formatUSD(amount);
    }

    // Symbol always before number for USD
    return `${sign}${currencySymbol}${value}`;
  }
}

/**
 * Format USD with optional cents display
 * Useful for whole dollar amounts where you don't want to show .00
 *
 * @param amount - Number to format as USD
 * @param showCents - Whether to show cents even for whole dollars (default: true)
 * @returns Formatted currency string
 *
 * @example
 * formatUSDWithOptionalCents(1500)
 * // Returns: "$1,500.00"
 *
 * @example
 * formatUSDWithOptionalCents(1500, false)
 * // Returns: "$1,500"
 *
 * @example
 * formatUSDWithOptionalCents(1500.50, false)
 * // Returns: "$1,500.50"
 */
export function formatUSDWithOptionalCents(
  amount: number,
  showCents: boolean = true
): string {
  const hasDecimals = amount % 1 !== 0;

  if (!showCents && !hasDecimals) {
    // Don't show cents for whole dollar amounts
    return formatUSD(amount, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Show cents
  return formatUSD(amount);
}
