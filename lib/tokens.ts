/** Shared design values. Components use CSS variables so themes remain consistent. */
export const colors = {
  primary: "var(--primary)", primaryHover: "var(--primary-hover)",
  primaryActive: "var(--primary-active)", brand: "var(--brand)",
  primaryLight: "var(--primary-light)", accent: "var(--accent)",
  successText: "var(--success-text)", successBg: "var(--success-bg)",
  warningText: "var(--warning-text)", warningBg: "var(--warning-bg)",
  errorText: "var(--error-text)", errorBg: "var(--error-bg)",
  text: "var(--foreground)", textSecondary: "var(--text-secondary)",
  caption: "var(--muted-foreground)", background: "var(--background)",
  surface: "var(--card)", border: "var(--border)",
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 48, 64] as const;
export const radius = { card: 16, button: 12 } as const;
export const buttonHeight = { default: 48, large: 52 } as const;
export const breakpoints = { mobile: "375px", tablet: "1024px", desktop: "1440px" } as const;
