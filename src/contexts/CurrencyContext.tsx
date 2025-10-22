"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { CURRENCY } from "@/lib/constants";
import type { Currency } from "@/types/currency";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

type CurrencyProviderProps = {
  children: React.ReactNode;
  defaultCurrency?: Currency;
};

function getCurrencyFromStorage(): Currency | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(CURRENCY.STORAGE_KEY);
    if (stored && (stored === "IQD" || stored === "USD")) {
      return stored as Currency;
    }
  } catch (error) {
    console.error("Error reading currency from localStorage:", error);
  }

  return null;
}

function saveCurrencyToStorage(currency: Currency): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(CURRENCY.STORAGE_KEY, currency);
  } catch (error) {
    console.error("Error saving currency to localStorage:", error);
  }
}

export function CurrencyProvider({
  children,
  defaultCurrency = CURRENCY.DEFAULT as Currency,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize currency from localStorage on mount
  useEffect(() => {
    const storedCurrency = getCurrencyFromStorage();
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
    setIsLoading(false);
  }, []);

  // Set currency and persist to localStorage
  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    saveCurrencyToStorage(newCurrency);
  }, []);

  const toggleCurrency = useCallback(() => {
    const newCurrency = currency === "IQD" ? "USD" : "IQD";
    setCurrency(newCurrency);
  }, [currency, setCurrency]);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    toggleCurrency,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);

  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}

export function usePrice() {
  const { currency } = useCurrency();

  // Memoize functions to prevent recreation on every render
  const getSymbol = useCallback(() => {
    return CURRENCY.SYMBOLS[currency];
  }, [currency]);

  const getDecimals = useCallback(() => {
    return CURRENCY.DECIMALS[currency];
  }, [currency]);

  const convertFromIQD = useCallback(
    (amountInIQD: number) => {
      if (currency === "IQD") {
        return amountInIQD;
      }
      return amountInIQD / CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
    },
    [currency]
  );

  const convertToIQD = useCallback(
    (amount: number) => {
      if (currency === "IQD") {
        return amount;
      }
      return amount * CURRENCY.EXCHANGE_RATES.IQD_TO_USD;
    },
    [currency]
  );

  const formatPrice = useCallback(
    (amount: number) => {
      const decimals = CURRENCY.DECIMALS[currency];
      const symbol = CURRENCY.SYMBOLS[currency];

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
      }).format(amount);

      // USD: symbol before amount ($196.97)
      // IQD: symbol after amount (260,000 د.ع.)
      if (currency === "USD") {
        return `${symbol}${formatted}`;
      } else {
        return `${formatted} ${symbol}`;
      }
    },
    [currency]
  );

  return useMemo(
    () => ({
      currency,
      getSymbol,
      getDecimals,
      convertFromIQD,
      convertToIQD,
      formatPrice,
    }),
    [
      currency,
      getSymbol,
      getDecimals,
      convertFromIQD,
      convertToIQD,
      formatPrice,
    ]
  );
}

export function useProductPrice(priceInIQD: number): string {
  const { currency } = useCurrency();

  return useMemo(() => {
    // Convert from IQD to current currency
    const priceInCurrentCurrency =
      currency === "IQD"
        ? priceInIQD
        : priceInIQD / CURRENCY.EXCHANGE_RATES.IQD_TO_USD;

    // Format with appropriate decimals and symbol
    const decimals = CURRENCY.DECIMALS[currency];
    const symbol = CURRENCY.SYMBOLS[currency];

    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: true,
    }).format(priceInCurrentCurrency);

    // USD: symbol before amount ($196.97)
    // IQD: symbol after amount (260,000 د.ع.)
    return currency === "USD"
      ? `${symbol}${formatted}`
      : `${formatted} ${symbol}`;
  }, [priceInIQD, currency]);
}
