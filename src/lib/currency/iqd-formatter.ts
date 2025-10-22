export type IqdFormatOptions = {
  readonly locale?: "en-US" | string;
  readonly useGrouping?: boolean; // Use thousand separators (default: true)
  readonly currencyDisplay?: "symbol" | "code" | "name"; // How to display currency (default: 'symbol' = 'د.ع.')
  readonly minimumFractionDigits?: number; // default: 0
  readonly maximumFractionDigits?: number; // default: 0
};

// Result of formatting operation
export type FormattedCurrency = {
  readonly value: string; // Formatted string (e.g., "IQD 1,500")
  readonly numericValue: number; // Original numeric value
  readonly currency: "IQD";
  readonly locale: string;
};

/**
 * Format a number as Iraqi Dinar (IQD) currency
 *
 * IQD is the official currency of Iraq. The dinar is subdivided into 1,000 fils,
 * but fils are rarely used in practice due to low value.
 * All numbers are formatted using Western numerals (0-9).
 * By default, uses the Arabic symbol "د.ع." (Dinar Iraq).
 *
 * @param amount - Number to format as IQD
 * @param options - Formatting options
 * @returns Formatted currency string with Western numerals
 *
 * @example
 * formatIQD(1500000)
 * // Returns: "1,500,000 د.ع."
 *
 * @example
 * formatIQD(1500000, { currencyDisplay: 'code' })
 * // Returns: "IQD 1,500,000"
 */
export function formatIQD(
  amount: number,
  options: IqdFormatOptions = {}
): string {
  const {
    locale = "en-US",
    useGrouping = true,
    currencyDisplay = "symbol",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  // Always use en-US for number formatting to ensure Western numerals
  const numericLocale = "en-US";

  // Format the number
  const formatted = new Intl.NumberFormat(numericLocale, {
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);

  // Use Arabic symbol "د.ع." by default, or code if specified
  if (currencyDisplay === "symbol") {
    return `${formatted} د.ع.`;
  } else if (currencyDisplay === "code") {
    return `IQD ${formatted}`;
  } else if (currencyDisplay === "name") {
    return `${formatted} Iraqi Dinar`;
  }

  // Default to symbol
  return `${formatted} د.ع.`;
}

/**
 * Format a number as IQD with full metadata
 * All numbers are formatted using Western numerals (0-9).
 *
 * @param amount - Number to format as IQD
 * @param options - Formatting options
 * @returns Formatted currency object with metadata
 *
 * @example
 * formatIQDWithMeta(1500000)
 * // Returns: { value: "IQD 1,500,000", numericValue: 1500000, currency: 'IQD', locale: 'en-US' }
 */
export function formatIQDWithMeta(
  amount: number,
  options: IqdFormatOptions = {}
): FormattedCurrency {
  const locale = options.locale || "en-US";

  return {
    value: formatIQD(amount, options),
    numericValue: amount,
    currency: "IQD",
    locale,
  };
}

/**
 * Parse a formatted IQD string back to a number
 * Handles English numerals and formats
 *
 * @param formattedValue - Formatted IQD string
 * @returns Numeric value, or null if parsing fails
 *
 * @example
 * parseIQD("IQD 1,500,000")
 * // Returns: 1500000
 */
export function parseIQD(formattedValue: string): number | null {
  if (!formattedValue || typeof formattedValue !== "string") {
    return null;
  }

  // Remove currency symbols and separators
  // Remove: IQD, د.ع, currency symbols, spaces, commas, Arabic comma (،), Arabic thousands separator (٬)
  const normalized = formattedValue.replace(/IQD|د\.ع|[^\d.-]/g, "").trim();

  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Format IQD amount in shortened form (e.g., 1.5M, 500K)
 * Useful for displaying large amounts in compact spaces
 * All numbers are formatted using Western numerals (0-9).
 * Uses the Arabic symbol "د.ع." by default.
 *
 * @param amount - Number to format
 * @param useSymbol - Whether to use symbol (د.ع.) or code (IQD), default: true
 * @returns Shortened formatted string with Western numerals
 *
 * @example
 * formatIQDCompact(1500000)
 * // Returns: "1.5M د.ع."
 *
 * @example
 * formatIQDCompact(750000)
 * // Returns: "750K د.ع."
 *
 * @example
 * formatIQDCompact(1500000, false)
 * // Returns: "IQD 1.5M"
 */
export function formatIQDCompact(
  amount: number,
  useSymbol: boolean = true
): string {
  const currencySymbol = useSymbol ? "د.ع." : "IQD";
  const numericLocale = "en-US";

  // Use compact notation if available (requires modern browsers/Node)
  try {
    const formatted = new Intl.NumberFormat(numericLocale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(amount);

    // Symbol after number for Arabic, before for code
    return useSymbol
      ? `${formatted} ${currencySymbol}`
      : `${currencySymbol} ${formatted}`;
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
      return formatIQD(amount);
    }

    // Symbol after number for Arabic, before for code
    return useSymbol
      ? `${sign}${value} ${currencySymbol}`
      : `${sign}${currencySymbol} ${value}`;
  }
}
