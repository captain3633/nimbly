import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { spacing, radius, typography } from "../../theme";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  loading = false,
  children,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.surface;
    switch (variant) {
      case "primary":
        return colors.sage;
      case "secondary":
        return colors.surface;
      case "ghost":
        return "transparent";
      default:
        return colors.sage;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
      case "ghost":
        return colors.textPrimary;
      default:
        return "#FFFFFF";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "sm":
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case "lg":
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: radius.md,
          ...getPadding(),
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === "sm" ? typography.fontSize.sm : typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    textAlign: "center",
  },
});
