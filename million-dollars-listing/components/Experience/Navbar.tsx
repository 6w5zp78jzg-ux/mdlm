"use client";
import { useState } from "react";

const LOCALES = ["EN", "ES", "FR", "RU"];

export default function Navbar() {
  const [activeLang, setActiveLang] = useState("ES");

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", zIndex: 100,
      background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
    }}>
      <div>
        <p style={{ color: "#c9a96e", fontFamily: "Georgia, serif", fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)", letterSpacing: "0.25em", fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
          MILLION DOLLARS
        </p>
        <p style={{ color: "#c9a96e", fontFamily: "Georgia, serif", fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)", letterSpacing: "0.5em", fontWeight: 300, margin: 0, opacity: 0.6 }}>
          LISTING MARBELLA
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
        {LOCALES.map((lang, i) => (
          <div key={lang} style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => setActiveLang(lang)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: activeLang === lang ? "#c9a96e" : "rgba(255,255,255,0.35)",
              fontFamily: "Georgia, serif", fontSize: "0.55rem",
              letterSpacing: "0.2em", padding: "0.3rem 0.5rem",
              transition: "color 0.3s ease", textTransform: "uppercase",
            }}>{lang}</button>
            {i < LOCALES.length - 1 && (
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.4rem" }}>|</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
