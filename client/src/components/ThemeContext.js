import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../Themes";
import axios from "axios";

axios.defaults.withCredentials = true; // abilita l'inclusione dei cookie nelle richieste axios

const ThemeContext = createContext(); // context per il tema

function hexToRgb(value) {
  // converte un valore colore (hex o rgb(a)) nella stringa "r,g,b"
  if (value.startsWith("rgba") || value.startsWith("rgb")) {
    const nums = value.match(/\d+/g);
    if (nums && nums.length >= 3) {
      return `${nums[0]},${nums[1]},${nums[2]}`; 
    }
    return "0,0,0";
  }

  const hex = value.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`; 
}

function adjustColorForEffective(value, factor = 0.15) {
  // Scurisci o modifica il colore leggermente per la variante effective
  const rgb = hexToRgb(value).split(",").map(Number);
  const adjusted = rgb.map(c => Math.max(0, Math.min(255, Math.floor(c * (1 - factor)))));
  return `rgb(${adjusted.join(",")})`;
}

function applyPaletteToRoot(key, fallbackKey = "avatar1", rootEl = null) {
  // applica la palette selezionata impostando variabili CSS su :root
  const palette = themes[key] || themes[fallbackKey];
  if (!palette) return;

  const root = rootEl || document.documentElement;

  Object.entries(palette).forEach(([name, value]) => {
    root.style.setProperty(`--color-${name}`, value);

    try {
      const rgb = hexToRgb(value);
      root.style.setProperty(`--color-${name}-rgb`, rgb);
    } catch (err) {
      root.style.setProperty(`--color-${name}-rgb`, "0,0,0");
    }

     try {
      const effective = adjustColorForEffective(value);
      root.style.setProperty(`--color-${name}-effective`, effective);
      const rgbEffective = hexToRgb(effective);
      root.style.setProperty(`--color-${name}-rgb-effective`, rgbEffective);
    } catch {
      root.style.setProperty(`--color-${name}-effective`, value);
      root.style.setProperty(`--color-${name}-rgb-effective`, "0,0,0");
    }
    
  });

  root.setAttribute("data-palette", key);
}

export function ThemeProvider({ children, initialKey = "avatar1" }) {
  // Provider che espone la chiave tema e si occupa di sincronizzare stato locale e remoto
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem("themeKey") || initialKey;
  });

  // applica la palette e salva la chiave in localStorage quando cambia
  useEffect(() => {
    applyPaletteToRoot(themeKey, initialKey);
    localStorage.setItem("themeKey", themeKey);
  }, [themeKey, initialKey]);

  // aggiorna la chiave tema localmente e la invia al server (ottimistico)
  const updateThemeKey = async (key) => {
    setThemeKey(key);
    localStorage.setItem("themeKey", key);

    try {
      await axios.post("/api/user/setPaletteKey", { paletteKey: key });
    } catch (err) {
      console.error("Errore nel salvataggio remoto della paletteKey:", err);
    }
  };

  // al primo montaggio: prova a recuperare la palette dell'utente dal server
  useEffect(() => {
    let mounted = true;

    axios
      .get("/api/user/auth")
      .then((res) => {
        if (!mounted) return;
        const serverKey = res.data?.settings?.paletteKey;
        //se non presente, prova a estrarre da propic (es. /pfp/avatar2.png)
        const fromPropic =
          res.data?.propic &&
          (/(?:\/?pfp\/(avatar\d+)\.png)/.exec(res.data.propic) || [])[1];

        const keyToUse = serverKey || fromPropic;
        if (keyToUse && keyToUse !== themeKey) {
          setThemeKey(keyToUse);
        }
      })
      .catch((_) => {
        //Non autenticato o token scaduto -> mantieni locale
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey: updateThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // hook per accedere al ThemeContext
  return useContext(ThemeContext);
}
