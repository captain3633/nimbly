// Nimbly Visual System - Colors
// Follows docs/visuals.md strictly

export const colors = {
  // Brand Colors (same in light and dark)
  sage: "#5F7D73",
  amber: "#D9A441",

  light: {
    background: "#FAFAF7",
    card: "#FFFFFF",
    surface: "#F1F2EE",
    textPrimary: "#2E2E2E",
    textSecondary: "#5C5C5C",
    textMuted: "#8A8A8A",
    border: "#E2E3DF",
    success: "#5F7D73",
    warning: "#D9A441",
    error: "#B5533C",
  },

  dark: {
    background: "#0F1513",
    card: "#1C2421",
    surface: "#161D1A",
    textPrimary: "#EDEFEA",
    textSecondary: "#C7CBC4",
    textMuted: "#9AA09A",
    border: "#2A332F",
    success: "#7FA89C",
    warning: "#E6BC63",
    error: "#D07A63",
  },
};

export type Theme = "light" | "dark";
