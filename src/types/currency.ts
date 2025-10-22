import type { CURRENCY } from "@/lib/constants";

// Supported currency codes
export type Currency = (typeof CURRENCY.SUPPORTED)[number];

// Currency symbol type
export type CurrencySymbol = "د.ع." | "$";

// Price with currency information
export type PriceWithCurrency = {
  readonly amount: number;
  readonly currency: Currency;
  readonly formatted: string;
  readonly symbol: CurrencySymbol;
};

// Currency conversion result
export type ConversionResult = {
  readonly originalAmount: number;
  readonly originalCurrency: Currency;
  readonly convertedAmount: number;
  readonly convertedCurrency: Currency;
  readonly exchangeRate: number;
};

// Price display format options
export type PriceFormatOptions = {
  readonly showSymbol?: boolean;
  readonly showCode?: boolean;
  readonly decimals?: number;
  readonly useGrouping?: boolean;
};

// Currency preference for localStorage
export type CurrencyPreference = {
  readonly currency: Currency;
  readonly lastUpdated: string;
};
