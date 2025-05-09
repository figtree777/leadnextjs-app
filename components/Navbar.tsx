import React, { useEffect, useState } from "react";

const THEME_KEY = "theme-preference";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Navbar() {
  const [theme, setTheme] = useState<Theme>("system");

  // Set initial theme based on localStorage or system
  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
      applyTheme(stored);
    } else {
      setTheme("system");
      applyTheme("system");
    }
  }, []);

  // Apply theme changes
  const applyTheme = (selected: Theme) => {
    let applied = selected;
    if (selected === "system") {
      applied = getSystemTheme();
    }
    document.documentElement.setAttribute("data-theme", applied);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
    localStorage.setItem(THEME_KEY, selected);
    applyTheme(selected);
  };

  // Listen for system theme changes if in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const listener = () => {
      applyTheme("system");
    };
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
    };
  }, [theme]);

  return (
    <nav style={{
      width: "100%",
      padding: "1rem 2rem",
      background: "var(--navbar-bg, #fff)",
      borderBottom: "1px solid #eaeaea",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <span style={{ fontWeight: 700, fontSize: "1.2rem" }}>leadnextjs</span>
      <div>
        <label htmlFor="theme-select" style={{ marginRight: 8 }}>Theme:</label>
        <select id="theme-select" value={theme} onChange={handleChange} style={{ fontSize: "1rem", padding: "0.25rem 0.5rem" }}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    </nav>
  );
}
