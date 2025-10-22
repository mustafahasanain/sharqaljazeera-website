// Governorate type definition
export type Governorate = {
  readonly code: string; // ISO 3166-2:IQ code (e.g., "IQ-BA" for Baghdad)
  readonly nameEn: string;
  readonly nameAr: string;
  readonly region: Region;
  readonly capital: string;
  readonly capitalAr: string;
};

// Geographical regions of Iraq
export type Region =
  | "Central Iraq"
  | "Southern Iraq"
  | "Northern Iraq"
  | "Western Iraq"
  | "Kurdistan Region";

export const GOVERNORATES: readonly Governorate[] = [
  {
    code: "IQ-BA",
    nameEn: "Baghdad",
    nameAr: "بغداد",
    region: "Central Iraq",
    capital: "Baghdad",
    capitalAr: "بغداد",
  },
  {
    code: "IQ-NI",
    nameEn: "Nineveh",
    nameAr: "نينوى",
    region: "Northern Iraq",
    capital: "Mosul",
    capitalAr: "الموصل",
  },
  {
    code: "IQ-BA",
    nameEn: "Basra",
    nameAr: "البصرة",
    region: "Southern Iraq",
    capital: "Basra",
    capitalAr: "البصرة",
  },
  {
    code: "IQ-SU",
    nameEn: "Sulaymaniyah",
    nameAr: "السليمانية",
    region: "Kurdistan Region",
    capital: "Sulaymaniyah",
    capitalAr: "السليمانية",
  },
  {
    code: "IQ-AR",
    nameEn: "Erbil",
    nameAr: "أربيل",
    region: "Kurdistan Region",
    capital: "Erbil",
    capitalAr: "أربيل",
  },
  {
    code: "IQ-DI",
    nameEn: "Diyala",
    nameAr: "ديالى",
    region: "Central Iraq",
    capital: "Baqubah",
    capitalAr: "بعقوبة",
  },
  {
    code: "IQ-AN",
    nameEn: "Anbar",
    nameAr: "الأنبار",
    region: "Western Iraq",
    capital: "Ramadi",
    capitalAr: "الرمادي",
  },
  {
    code: "IQ-KI",
    nameEn: "Kirkuk",
    nameAr: "كركوك",
    region: "Northern Iraq",
    capital: "Kirkuk",
    capitalAr: "كركوك",
  },
  {
    code: "IQ-NA",
    nameEn: "Najaf",
    nameAr: "النجف",
    region: "Central Iraq",
    capital: "Najaf",
    capitalAr: "النجف",
  },
  {
    code: "IQ-KA",
    nameEn: "Karbala",
    nameAr: "كربلاء",
    region: "Central Iraq",
    capital: "Karbala",
    capitalAr: "كربلاء",
  },
  {
    code: "IQ-BB",
    nameEn: "Babylon",
    nameAr: "بابل",
    region: "Central Iraq",
    capital: "Hillah",
    capitalAr: "الحلة",
  },
  {
    code: "IQ-WA",
    nameEn: "Wasit",
    nameAr: "واسط",
    region: "Central Iraq",
    capital: "Kut",
    capitalAr: "الكوت",
  },
  {
    code: "IQ-SD",
    nameEn: "Saladin",
    nameAr: "صلاح الدين",
    region: "Central Iraq",
    capital: "Tikrit",
    capitalAr: "تكريت",
  },
  {
    code: "IQ-QA",
    nameEn: "Dhi Qar",
    nameAr: "ذي قار",
    region: "Southern Iraq",
    capital: "Nasiriyah",
    capitalAr: "الناصرية",
  },
  {
    code: "IQ-MA",
    nameEn: "Maysan",
    nameAr: "ميسان",
    region: "Southern Iraq",
    capital: "Amarah",
    capitalAr: "العمارة",
  },
  {
    code: "IQ-MU",
    nameEn: "Muthanna",
    nameAr: "المثنى",
    region: "Southern Iraq",
    capital: "Samawah",
    capitalAr: "السماوة",
  },
  {
    code: "IQ-DH",
    nameEn: "Duhok",
    nameAr: "دهوك",
    region: "Kurdistan Region",
    capital: "Duhok",
    capitalAr: "دهوك",
  },
  {
    code: "IQ-DA",
    nameEn: "Diwaniyah",
    nameAr: "القادسية",
    region: "Southern Iraq",
    capital: "Diwaniyah",
    capitalAr: "الديوانية",
  },
  {
    code: "IQ-HA",
    nameEn: "Halabja",
    nameAr: "حلبجة",
    region: "Kurdistan Region",
    capital: "Halabja",
    capitalAr: "حلبجة",
  },
] as const;

// Helper type for governorate code values
export type GovernorateCode = (typeof GOVERNORATES)[number]["code"];

// Helper type for region values
export type RegionValue = (typeof GOVERNORATES)[number]["region"];

export function getGovernorateByCode(code: string): Governorate | undefined {
  return GOVERNORATES.find((gov) => gov.code === code);
}

export function getGovernorateByName(nameEn: string): Governorate | undefined {
  return GOVERNORATES.find(
    (gov) => gov.nameEn.toLowerCase() === nameEn.toLowerCase()
  );
}

export function getGovernoratesByRegion(
  region: Region
): readonly Governorate[] {
  return GOVERNORATES.filter((gov) => gov.region === region);
}

export function getAllRegions(): readonly Region[] {
  return Array.from(new Set(GOVERNORATES.map((gov) => gov.region)));
}

export function getGovernorateOptions(
  locale: "en" | "ar" = "en"
): readonly { readonly value: string; readonly label: string }[] {
  return GOVERNORATES.map((gov) => ({
    value: gov.code,
    label: locale === "ar" ? gov.nameAr : gov.nameEn,
  }));
}
