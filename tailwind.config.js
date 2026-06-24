/**
 * Tailwind CSS configuration.
 *
 * Colors are defined as CSS variable references so globals.css can swap the
 * whole palette between light (:root) and dark (.dark) without touching any
 * component. Variables store space-separated RGB channel values so Tailwind's
 * opacity modifier syntax (bg-ink/80, text-muted/60, …) keeps working —
 * Tailwind expands them to rgb(var(--color-ink) / 0.8) automatically.
 *
 * boxShadow.glow / glow-sm / glow-md also reference CSS variables: neutral
 * drop shadows in light mode, colored glows in dark mode — same class names,
 * different effect depending on which theme is active.
 *
 * darkMode: "class" means the .dark class on <html> controls the theme.
 * layout.tsx applies it via an inline script before React hydrates so there
 * is no flash of the wrong theme on first load.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface:    "rgb(var(--color-surface)    / <alpha-value>)",
        ink:        "rgb(var(--color-ink)         / <alpha-value>)",
        muted:      "rgb(var(--color-muted)       / <alpha-value>)",
        accent:     "rgb(var(--color-accent)      / <alpha-value>)",
        accentDark: "rgb(var(--color-accent-dark) / <alpha-value>)",
        accentSoft: "rgb(var(--color-accent-soft) / <alpha-value>)",
        accentGlow: "rgb(var(--color-accent-glow) / <alpha-value>)",
        warning:    "rgb(var(--color-warning)     / <alpha-value>)",
        success:    "rgb(var(--color-success)     / <alpha-value>)",
      },
      boxShadow: {
        glow:     "var(--shadow-glow)",
        "glow-sm": "var(--shadow-glow-sm)",
        "glow-md": "var(--shadow-glow-md)",
      },
      keyframes: {
        "hero-glow-drift": {
          "0%, 100%": { transform: "translateX(-50%) scale(1)", opacity: "0.65" },
          "50%":      { transform: "translateX(-50%) scale(1.14)", opacity: "0.9" },
        },
        "illus-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "hero-glow":   "hero-glow-drift 10s ease-in-out infinite",
        "illus-float": "illus-float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
