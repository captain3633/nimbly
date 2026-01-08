import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: any;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemTheme === "dark" ? "dark" : "light");

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem("nimbly-theme").then((saved) => {
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    AsyncStorage.setItem("nimbly-theme", newTheme);
  };

  const { colors } = require("../theme");
  const themeColors = {
    ...colors,
    ...(theme === "light" ? colors.light : colors.dark),
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
