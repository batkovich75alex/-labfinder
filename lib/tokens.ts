// LabFinder Design Tokens

export const colors = {
  primary500: "#1677FF",
  primary600: "#0969E8",
  accent500: "#18B98B",
  textPrimary: "#101828",
  textSecondary: "#475467",
  textTertiary: "#667085",
  bgPage: "#F8FAFC",
  bgSurface: "#FFFFFF",
  borderDefault: "#E4E7EC",
  success: "#12B76A",
  warning: "#F79009",
  error: "#F04438",
  priceExact: "#101828",
  priceFrom: "#475467",
  priceUnavailable: "#98A2B3",
} as const;

export const spacing = {
  1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px",
  6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px",
} as const;

export const radius = {
  xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px", full: "999px",
} as const;

export const breakpoints = {
  mobile: "375px", tablet: "1024px", desktop: "1440px",
} as const;