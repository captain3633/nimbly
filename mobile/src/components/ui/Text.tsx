import React from "react";
import { Text as RNText, StyleSheet, TextProps as RNTextProps } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { typography } from "../../theme";

type TextVariant = "h1" | "h2" | "h3" | "body" | "caption" | "muted";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children: React.ReactNode;
}

export function Text({ variant = "body", style, children, ...props }: TextProps) {
  const { colors } = useTheme();

  const getStyle = () => {
    switch (variant) {
      case "h1":
        return {
          fontSize: typography.fontSize.xxxl,
          fontWeight: typography.fontWeight.bold,
          color: colors.textPrimary,
        };
      case "h2":
        return {
          fontSize: typography.fontSize.xxl,
          fontWeight: typography.fontWeight.semibold,
          color: colors.textPrimary,
        };
      case "h3":
        return {
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: colors.textPrimary,
        };
      case "body":
        return {
          fontSize: typography.fontSize.base,
          color: colors.textPrimary,
        };
      case "caption":
        return {
          fontSize: typography.fontSize.sm,
          color: colors.textSecondary,
        };
      case "muted":
        return {
          fontSize: typography.fontSize.sm,
          color: colors.textMuted,
        };
      default:
        return {
          fontSize: typography.fontSize.base,
          color: colors.textPrimary,
        };
    }
  };

  return (
    <RNText style={[getStyle(), style]} {...props}>
      {children}
    </RNText>
  );
}
