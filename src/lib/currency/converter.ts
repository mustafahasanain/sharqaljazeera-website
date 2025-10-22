import { CURRENCY } from "@/lib/constants";
import type {
  Currency,
  ConversionResult,
  PriceWithCurrency,
} from "@/types/currency";

/**
 * Convert amount from IQD to USD
 * Prices are stored in IQD (whole numbers), converted to USD with 2 decimals
 *
 * @param amountInIQD - Amount in Iraqi Dinar (whole number)
 * @returns Amount in US Dollars (with decimals)
 *
 * @example
 * convertIQDtoUSD(260000)
 * // Returns: 196.96969... (260000 / 1320)
 *
 * @example
 * convertIQDtoUSD(1320)
 * // Returns: 1.0
 */
export function convertIQDtoUSD(amountInIQD: number): number {
  return amountInIQD / CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
}

/**
 * Convert amount from USD to IQD
 * Note: Prices should be stored in IQD, this is mainly for reference
 *
 * @param amountInUSD - Amount in US Dollars
 * @returns Amount in Iraqi Dinar (whole number)
 *
 * @example
 * convertUSDtoIQD(196.97)
 * // Returns: 260000.4 → rounded to 260000
 *
 * @example
 * convertUSDtoIQD(1)
 * // Returns: 1320
 */
export function convertUSDtoIQD(amountInUSD: number): number {
  return amountInUSD * CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
}

/**
 * Convert amount from one currency to another
 *
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Converted amount
 *
 * @example
 * convertCurrency(260000, 'IQD', 'USD')
 * // Returns: 196.97
 *
 * @example
 * convertCurrency(100, 'USD', 'IQD')
 * // Returns: 132000
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  // If same currency, return the same amount
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Convert IQD to USD
  if (fromCurrency === "IQD" && toCurrency === "USD") {
    return convertIQDtoUSD(amount);
  }

  // Convert USD to IQD
  if (fromCurrency === "USD" && toCurrency === "IQD") {
    return convertUSDtoIQD(amount);
  }

  // Fallback (should never reach here with current currencies)
  return amount;
}

/**
 * Convert amount with detailed result including exchange rate
 *
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Conversion result with metadata
 *
 * @example
 * convertCurrencyWithDetails(260000, 'IQD', 'USD')
 * // Returns: {
 * //   originalAmount: 260000,
 * //   originalCurrency: 'IQD',
 * //   convertedAmount: 196.97,
 * //   convertedCurrency: 'USD',
 * //   exchangeRate: 1320
 * // }
 */
export function convertCurrencyWithDetails(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): ConversionResult {
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);

  let exchangeRate = 1;
  if (fromCurrency === "IQD" && toCurrency === "USD") {
    exchangeRate = CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
  } else if (fromCurrency === "USD" && toCurrency === "IQD") {
    exchangeRate = CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
  }

  return {
    originalAmount: amount,
    originalCurrency: fromCurrency,
    convertedAmount,
    convertedCurrency: toCurrency,
    exchangeRate,
  };
}

/**
 * Get currency symbol for a given currency code
 *
 * @param currency - Currency code
 * @returns Currency symbol
 *
 * @example
 * getCurrencySymbol('IQD')
 * // Returns: "د.ع."
 *
 * @example
 * getCurrencySymbol('USD')
 * // Returns: "$"
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY.SYMBOLS[currency];
}

/**
 * Get number of decimal places for a currency
 *
 * @param currency - Currency code
 * @returns Number of decimal places
 *
 * @example
 * getCurrencyDecimals('IQD')
 * // Returns: 0
 *
 * @example
 * getCurrencyDecimals('USD')
 * // Returns: 2
 */
export function getCurrencyDecimals(currency: Currency): number {
  return CURRENCY.DECIMALS[currency];
}

/**
 * Format a price with the appropriate symbol and decimals
 *
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted price string
 *
 * @example
 * formatPrice(260000, 'IQD')
 * // Returns: "260,000 د.ع."
 *
 * @example
 * formatPrice(196.97, 'USD')
 * // Returns: "$196.97"
 */
export function formatPrice(amount: number, currency: Currency): string {
  const decimals = getCurrencyDecimals(currency);
  const symbol = getCurrencySymbol(currency);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  }).format(amount);

  // USD: symbol before amount ($196.97)
  // IQD: symbol after amount (260,000 د.ع.)
  if (currency === "USD") {
    // Handle negative USD amounts: -$50.25, not $-50.25
    if (amount < 0) {
      return `-${symbol}${formatted.replace("-", "")}`;
    }
    return `${symbol}${formatted}`;
  } else {
    return `${formatted} ${symbol}`;
  }
}

/**
 * Format a price with full currency information
 *
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Price with currency information
 *
 * @example
 * formatPriceWithCurrency(260000, 'IQD')
 * // Returns: {
 * //   amount: 260000,
 * //   currency: 'IQD',
 * //   formatted: "260,000 د.ع.",
 * //   symbol: "د.ع."
 * // }
 */
export function formatPriceWithCurrency(
  amount: number,
  currency: Currency
): PriceWithCurrency {
  return {
    amount,
    currency,
    formatted: formatPrice(amount, currency),
    symbol: getCurrencySymbol(currency) as "د.ع." | "$",
  };
}

/**
 * Convert and format a price from one currency to another
 *
 * @param amount - Amount in source currency
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @returns Formatted price in target currency
 *
 * @example
 * convertAndFormatPrice(260000, 'IQD', 'USD')
 * // Returns: "$196.97"
 *
 * @example
 * convertAndFormatPrice(100, 'USD', 'IQD')
 * // Returns: "132,000 د.ع."
 */
export function convertAndFormatPrice(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): string {
  const converted = convertCurrency(amount, fromCurrency, toCurrency);
  return formatPrice(converted, toCurrency);
}

/**
 * Parse a formatted price string back to a number
 *
 * @param formattedPrice - Formatted price string
 * @returns Numeric value, or null if parsing fails
 *
 * @example
 * parseFormattedPrice("260,000 د.ع.")
 * // Returns: 260000
 *
 * @example
 * parseFormattedPrice("$196.97")
 * // Returns: 196.97
 */
export function parseFormattedPrice(formattedPrice: string): number | null {
  if (!formattedPrice || typeof formattedPrice !== "string") {
    return null;
  }

  // Remove currency symbols and separators, but keep decimal point
  const normalized = formattedPrice
    .replace(/[$د\sع]/g, "") // Remove currency symbols and spaces
    .replace(/,/g, "") // Remove thousand separators
    .replace(/\./g, (match, offset, str) => {
      // Keep only the last dot as decimal point, remove others
      const lastDot = str.lastIndexOf(".");
      return offset === lastDot ? "." : "";
    })
    .trim();

  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}
