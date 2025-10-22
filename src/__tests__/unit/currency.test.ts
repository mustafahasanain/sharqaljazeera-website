import { describe, it, expect } from "vitest";
import {
  convertIQDtoUSD,
  convertUSDtoIQD,
  convertCurrency,
  convertCurrencyWithDetails,
  getCurrencySymbol,
  getCurrencyDecimals,
  formatPrice,
  formatPriceWithCurrency,
  convertAndFormatPrice,
  parseFormattedPrice,
} from "@/lib/currency/converter";
import {
  formatIQD,
  parseIQD,
  formatIQDCompact,
} from "@/lib/currency/iqd-formatter";
import {
  formatUSD,
  parseUSD,
  formatUSDCompact,
} from "@/lib/currency/usd-formatter";
import { CURRENCY } from "@/lib/constants";

describe("Currency Conversion", () => {
  describe("convertIQDtoUSD", () => {
    it("should convert IQD to USD correctly", () => {
      expect(convertIQDtoUSD(1320)).toBe(1);
      expect(convertIQDtoUSD(2640)).toBe(2);
      expect(convertIQDtoUSD(660)).toBe(0.5);
    });

    it("should handle large amounts", () => {
      expect(convertIQDtoUSD(260000)).toBeCloseTo(196.97, 2);
      expect(convertIQDtoUSD(1320000)).toBeCloseTo(1000, 2);
    });

    it("should handle zero", () => {
      expect(convertIQDtoUSD(0)).toBe(0);
    });

    it("should handle negative amounts", () => {
      expect(convertIQDtoUSD(-1320)).toBe(-1);
    });
  });

  describe("convertUSDtoIQD", () => {
    it("should convert USD to IQD correctly", () => {
      expect(convertUSDtoIQD(1)).toBe(1320);
      expect(convertUSDtoIQD(2)).toBe(2640);
      expect(convertUSDtoIQD(0.5)).toBe(660);
    });

    it("should handle large amounts", () => {
      expect(convertUSDtoIQD(196.97)).toBeCloseTo(260000, 0);
      expect(convertUSDtoIQD(1000)).toBe(1320000);
    });

    it("should handle zero", () => {
      expect(convertUSDtoIQD(0)).toBe(0);
    });

    it("should handle negative amounts", () => {
      expect(convertUSDtoIQD(-1)).toBe(-1320);
    });
  });

  describe("convertCurrency", () => {
    it("should convert IQD to USD", () => {
      expect(convertCurrency(1320, "IQD", "USD")).toBe(1);
      expect(convertCurrency(260000, "IQD", "USD")).toBeCloseTo(196.97, 2);
    });

    it("should convert USD to IQD", () => {
      expect(convertCurrency(1, "USD", "IQD")).toBe(1320);
      expect(convertCurrency(196.97, "USD", "IQD")).toBeCloseTo(260000, 0);
    });

    it("should return same amount when currencies are identical", () => {
      expect(convertCurrency(1000, "IQD", "IQD")).toBe(1000);
      expect(convertCurrency(100, "USD", "USD")).toBe(100);
    });
  });

  describe("convertCurrencyWithDetails", () => {
    it("should return detailed conversion result for IQD to USD", () => {
      const result = convertCurrencyWithDetails(1320, "IQD", "USD");

      expect(result.originalAmount).toBe(1320);
      expect(result.originalCurrency).toBe("IQD");
      expect(result.convertedAmount).toBe(1);
      expect(result.convertedCurrency).toBe("USD");
      expect(result.exchangeRate).toBe(1320);
    });

    it("should return detailed conversion result for USD to IQD", () => {
      const result = convertCurrencyWithDetails(1, "USD", "IQD");

      expect(result.originalAmount).toBe(1);
      expect(result.originalCurrency).toBe("USD");
      expect(result.convertedAmount).toBe(1320);
      expect(result.convertedCurrency).toBe("IQD");
      expect(result.exchangeRate).toBe(1320);
    });

    it("should handle same currency conversion", () => {
      const result = convertCurrencyWithDetails(1000, "IQD", "IQD");

      expect(result.originalAmount).toBe(1000);
      expect(result.convertedAmount).toBe(1000);
      expect(result.exchangeRate).toBe(1);
    });
  });
});

describe("Currency Symbols and Decimals", () => {
  describe("getCurrencySymbol", () => {
    it("should return correct symbol for IQD", () => {
      expect(getCurrencySymbol("IQD")).toBe("د.ع.");
    });

    it("should return correct symbol for USD", () => {
      expect(getCurrencySymbol("USD")).toBe("$");
    });
  });

  describe("getCurrencyDecimals", () => {
    it("should return 0 decimals for IQD", () => {
      expect(getCurrencyDecimals("IQD")).toBe(0);
    });

    it("should return 2 decimals for USD", () => {
      expect(getCurrencyDecimals("USD")).toBe(2);
    });
  });
});

describe("Price Formatting", () => {
  describe("formatPrice", () => {
    it("should format IQD prices correctly with symbol", () => {
      expect(formatPrice(260000, "IQD")).toBe("260,000 د.ع.");
      expect(formatPrice(1500000, "IQD")).toBe("1,500,000 د.ع.");
      expect(formatPrice(1000, "IQD")).toBe("1,000 د.ع.");
    });

    it("should format USD prices correctly with symbol", () => {
      expect(formatPrice(196.97, "USD")).toBe("$196.97");
      expect(formatPrice(1000.5, "USD")).toBe("$1,000.50");
      expect(formatPrice(10, "USD")).toBe("$10.00");
    });

    it("should handle zero amounts", () => {
      expect(formatPrice(0, "IQD")).toBe("0 د.ع.");
      expect(formatPrice(0, "USD")).toBe("$0.00");
    });

    it("should handle negative amounts", () => {
      expect(formatPrice(-1000, "IQD")).toBe("-1,000 د.ع.");
      expect(formatPrice(-50.25, "USD")).toBe("-$50.25");
    });
  });

  describe("formatPriceWithCurrency", () => {
    it("should return full price object for IQD", () => {
      const result = formatPriceWithCurrency(260000, "IQD");

      expect(result.amount).toBe(260000);
      expect(result.currency).toBe("IQD");
      expect(result.formatted).toBe("260,000 د.ع.");
      expect(result.symbol).toBe("د.ع.");
    });

    it("should return full price object for USD", () => {
      const result = formatPriceWithCurrency(196.97, "USD");

      expect(result.amount).toBe(196.97);
      expect(result.currency).toBe("USD");
      expect(result.formatted).toBe("$196.97");
      expect(result.symbol).toBe("$");
    });
  });

  describe("convertAndFormatPrice", () => {
    it("should convert and format IQD to USD", () => {
      expect(convertAndFormatPrice(260000, "IQD", "USD")).toBe("$196.97");
      expect(convertAndFormatPrice(1320, "IQD", "USD")).toBe("$1.00");
    });

    it("should convert and format USD to IQD", () => {
      expect(convertAndFormatPrice(1, "USD", "IQD")).toBe("1,320 د.ع.");
      expect(convertAndFormatPrice(100, "USD", "IQD")).toBe("132,000 د.ع.");
    });

    it("should format without conversion when same currency", () => {
      expect(convertAndFormatPrice(260000, "IQD", "IQD")).toBe("260,000 د.ع.");
      expect(convertAndFormatPrice(196.97, "USD", "USD")).toBe("$196.97");
    });
  });
});

describe("IQD Formatter", () => {
  describe("formatIQD", () => {
    it("should format with symbol by default", () => {
      expect(formatIQD(260000)).toBe("260,000 د.ع.");
    });

    it("should format with code when specified", () => {
      expect(formatIQD(260000, { currencyDisplay: "code" })).toBe(
        "IQD 260,000"
      );
    });

    it("should format with name when specified", () => {
      expect(formatIQD(260000, { currencyDisplay: "name" })).toBe(
        "260,000 Iraqi Dinar"
      );
    });

    it("should respect grouping option", () => {
      expect(formatIQD(260000, { useGrouping: false })).toBe("260000 د.ع.");
    });
  });

  describe("parseIQD", () => {
    it("should parse IQD formatted strings", () => {
      expect(parseIQD("260,000 د.ع.")).toBe(260000);
      expect(parseIQD("IQD 260,000")).toBe(260000);
      expect(parseIQD("1,500,000 د.ع.")).toBe(1500000);
    });

    it("should handle strings without separators", () => {
      expect(parseIQD("260000")).toBe(260000);
    });

    it("should return null for invalid inputs", () => {
      expect(parseIQD("")).toBeNull();
      expect(parseIQD("invalid")).toBeNull();
    });
  });

  describe("formatIQDCompact", () => {
    it("should format large amounts compactly with symbol", () => {
      expect(formatIQDCompact(1500000)).toBe("1.5M د.ع.");
      expect(formatIQDCompact(750000)).toBe("750K د.ع.");
    });

    it("should format with code when specified", () => {
      expect(formatIQDCompact(1500000, false)).toBe("IQD 1.5M");
    });
  });
});

describe("USD Formatter", () => {
  describe("formatUSD", () => {
    it("should format with symbol by default", () => {
      expect(formatUSD(196.97)).toBe("$196.97");
    });

    it("should format with code when specified", () => {
      expect(formatUSD(196.97, { currencyDisplay: "code" })).toBe("USD 196.97");
    });

    it("should format with name when specified", () => {
      expect(formatUSD(196.97, { currencyDisplay: "name" })).toBe(
        "196.97 US Dollar"
      );
    });

    it("should respect grouping option", () => {
      expect(formatUSD(1000.5, { useGrouping: false })).toBe("$1000.50");
    });
  });

  describe("parseUSD", () => {
    it("should parse USD formatted strings", () => {
      expect(parseUSD("$196.97")).toBe(196.97);
      expect(parseUSD("USD 196.97")).toBe(196.97);
      expect(parseUSD("$1,500.50")).toBe(1500.5);
    });

    it("should handle strings without separators", () => {
      expect(parseUSD("196.97")).toBe(196.97);
    });

    it("should return null for invalid inputs", () => {
      expect(parseUSD("")).toBeNull();
      expect(parseUSD("invalid")).toBeNull();
    });
  });

  describe("formatUSDCompact", () => {
    it("should format large amounts compactly with symbol", () => {
      expect(formatUSDCompact(1500.5)).toBe("$1.5K");
      expect(formatUSDCompact(750.25)).toMatch(/^\$\d+(\.\d+)?$/);
    });

    it("should format with code when specified", () => {
      expect(formatUSDCompact(1500.5, false)).toBe("USD1.5K");
    });
  });
});

describe("Parse Formatted Price", () => {
  it("should parse IQD formatted prices", () => {
    expect(parseFormattedPrice("260,000 د.ع.")).toBe(260000);
  });

  it("should parse USD formatted prices", () => {
    expect(parseFormattedPrice("$196.97")).toBe(196.97);
  });

  it("should handle mixed formats", () => {
    expect(parseFormattedPrice("1,500.50")).toBe(1500.5);
  });

  it("should return null for invalid inputs", () => {
    expect(parseFormattedPrice("")).toBeNull();
    expect(parseFormattedPrice("invalid")).toBeNull();
  });
});

describe("Currency Constants", () => {
  it("should have correct exchange rate", () => {
    expect(CURRENCY.EXCHANGE_RATES.IQD_TO_USD).toBe(1320);
  });

  it("should have correct symbols", () => {
    expect(CURRENCY.SYMBOLS.IQD).toBe("د.ع.");
    expect(CURRENCY.SYMBOLS.USD).toBe("$");
  });

  it("should have correct decimal settings", () => {
    expect(CURRENCY.DECIMALS.IQD).toBe(0);
    expect(CURRENCY.DECIMALS.USD).toBe(2);
  });

  it("should have correct default currency", () => {
    expect(CURRENCY.DEFAULT).toBe("IQD");
  });

  it("should have correct supported currencies", () => {
    expect(CURRENCY.SUPPORTED).toEqual(["IQD", "USD"]);
  });
});
