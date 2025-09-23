//src/components/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../Themes";
import axios from "axios";

axios.defaults.withCredentials = true; //importante: invia cookie al server

const ThemeContext = createContext();

function hexToRgb(hex) {
  //accetta: "#aabbcc" o "aabbcc"
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

function applyPaletteToRoot(key, fallbackKey = "avatar1", rootEl = null) {
  const palette = themes[key] || themes[fallbackKey];
  if (!palette) return;

  const root = rootEl || document.getElementById('app-root') || document.documentElement;

  Object.entries(palette).forEach(([name, value]) => {
    root.style.setProperty(`--color-${name}`, value);
    try {
      const rgb = hexToRgb(value);
      root.style.setProperty(`--color-${name}-rgb`, rgb);
    } catch (err) {
      root.style.setProperty(`--color-${name}-rgb`, "");
    }
  });

  if (root === document.documentElement) {
    document.documentElement.setAttribute("data-palette", key);
  } else {
    root.setAttribute("data-palette", key);
  }
}

export function ThemeProvider({ children, initialKey = "avatar1" }) {
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem("themeKey") || initialKey;
  });

  //applica palette ogni volta che cambia la chiave
  useEffect(() => {
    applyPaletteToRoot(themeKey, initialKey);
    localStorage.setItem("themeKey", themeKey);
  }, [themeKey, initialKey]);

  //funzione pubblica per aggiornare (ottimistica + salvataggio server)
  const updateThemeKey = async (key) => {
    //applico subito
    setThemeKey(key);
    localStorage.setItem("themeKey", key);

    try {
      //salvataggio remoto (richiede cookie di sessione: ensureAuth)
      await axios.post("/api/user/setPaletteKey", { paletteKey: key });
      //non richiedo il nuovo utente qui (l'endpoint torna l'utente aggiornato nel server-side route),
      //ma non è strettamente necessario per la palette perché l'aggiornamento locale è già fatto.
    } catch (err) {
      console.error("Errore nel salvataggio remoto della paletteKey:", err);
      //non rollback per non rompere UX; potresti decidere di fare rollback in caso di errore
    }
  };

  //al primo montaggio: se loggato, prendi la palette dal server
  useEffect(() => {
    let mounted = true;

    axios
      .get("/userauth")
      .then((res) => {
        if (!mounted) return;
        const serverKey = res.data?.settings?.paletteKey;
        //se non presente, prova a estrarre da propic (es. /pfp/avatar2.png)
        const fromPropic =
          res.data?.propic &&
          (/\/pfp\/(avatar\d+)\.png/.exec(res.data.propic) || [])[1];

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
  }, []); //esegui solo una volta al mount

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey: updateThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
