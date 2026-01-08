import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { spacing, radius, typography } from "../../theme";

interface InputProps extends TextInputProps {}

export function Input({ style, ...props }: InputProps) {
  const { colors, theme } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.textPrimary,
          borderRadius: radius.md,
        },
        style,
      ]}
      placeholderTextColor={colors.textMuted}
      keyboardAppearance={theme}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
  },
});
