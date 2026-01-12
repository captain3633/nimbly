import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: '#FAFAF7',
  surface: '#FFFFFF',
  subtleSurface: '#F1F2EE',
  primary: '#5F7D73',
  secondary: '#D9A441',
  text: {
    primary: '#2E2E2E',
    secondary: '#5C5C5C',
    muted: '#8A8A8A',
  },
  border: '#E2E3DF',
  success: '#5F7D73',
  error: '#B5533C',
  amber: '#D9A441',
  sage: '#5F7D73',
};

const darkColors = {
  background: '#0F1513',
  surface: '#1C2421',
  subtleSurface: '#161D1A',
  primary: '#5F7D73',
  secondary: '#D9A441',
  text: {
    primary: '#EDEFEA',
    secondary: '#C7CBC4',
    muted: '#9AA09A',
  },
  border: '#2A332F',
  success: '#7FA89C',
  error: '#D07A63',
  amber: '#E6BC63',
  sage: '#5F7D73',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
