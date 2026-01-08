import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Text } from "./ui/Text";
import { spacing } from "../theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Text variant="body">{theme === "light" ? "🌙" : "☀️"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.sm,
  },
});
