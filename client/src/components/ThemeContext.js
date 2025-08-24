// src/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../Themes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState("avatar1");

  // Ogni volta che cambia themeKey, aggiorna le CSS vars
  useEffect(() => {
    const palette = themes[themeKey];
    if (!palette) return;
    Object.entries(palette).forEach(([name, value]) => {
      document.documentElement.style.setProperty(`--color-${name}`, value);
    });
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}