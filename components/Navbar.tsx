import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const THEME_KEY = "theme-preference";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("system");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const session = localStorage.getItem("session");
    setIsLoggedIn(!!session);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    setIsLoggedIn(false);
    router.push("/");
  };

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

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
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
      background: "var(--navbar-bg)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <Link href="/" style={{ textDecoration: "none", color: "var(--text-primary)" }}>
        <span style={{ 
          fontWeight: 700, 
          fontSize: "1.3rem", 
          cursor: "pointer",
          background: "linear-gradient(90deg, #0070f3, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px"
        }}>leadnextjs</span>
      </Link>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isLoggedIn ? (
          <>
            <Link href="/leads">
              <span style={{
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                padding: "0.5rem 0.8rem",
                borderRadius: "0.5rem",
                transition: "all 0.2s ease",
                background: router.pathname === "/leads" ? "var(--card-bg)" : "transparent",
                border: router.pathname === "/leads" ? "1px solid var(--border-color)" : "none"
              }}>
                Leads Catalog
              </span>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s ease"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button
              style={{
                background: "var(--primary-color, #0070f3)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s ease"
              }}
            >
              Login
            </button>
          </Link>
        )}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          background: "var(--card-bg)", 
          padding: "0.4rem", 
          borderRadius: "2rem",
          border: "1px solid var(--border-color)"
        }}>
          {/* Light mode option */}
          <button 
            onClick={() => handleThemeChange("light")} 
            style={{
              background: theme === "light" ? "var(--primary-color, #0070f3)" : "transparent",
              color: theme === "light" ? "white" : "var(--text-secondary)",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.5rem 0.8rem",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            ☀️
          </button>
          
          {/* System option */}
          <button 
            onClick={() => handleThemeChange("system")} 
            style={{
              background: theme === "system" ? "var(--primary-color, #0070f3)" : "transparent",
              color: theme === "system" ? "white" : "var(--text-secondary)",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.5rem 0.8rem",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            ⚙️
          </button>
          
          {/* Dark mode option */}
          <button 
            onClick={() => handleThemeChange("dark")} 
            style={{
              background: theme === "dark" ? "var(--primary-color, #0070f3)" : "transparent",
              color: theme === "dark" ? "white" : "var(--text-secondary)",
              border: "none",
              borderRadius: "1.5rem",
              padding: "0.5rem 0.8rem",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
          >
            🌙
          </button>
        </div>
      </div>
    </nav>
  );
}
