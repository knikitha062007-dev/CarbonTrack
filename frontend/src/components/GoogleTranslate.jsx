/**
 * LanguageSelector.jsx (was GoogleTranslate.jsx)
 *
 * Uses react-i18next for instant, no-reload translation.
 * All Google Translate dependencies removed.
 * UI (glassmorphism dropdown, icons, animations) preserved exactly.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaChevronDown, FaCheck } from "react-icons/fa";

const LANGS = [
  { code: "en", label: "English",   native: "English",  flag: "🇬🇧" },
  { code: "hi", label: "Hindi",     native: "हिन्दी",    flag: "🇮🇳" },
  { code: "kn", label: "Kannada",   native: "ಕನ್ನಡ",    flag: "🇮🇳" },
  { code: "te", label: "Telugu",    native: "తెలుగు",   flag: "🇮🇳" },
  { code: "ta", label: "Tamil",     native: "தமிழ்",    flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", native: "മലയാളം",  flag: "🇮🇳" },
];

/* ── Portal dropdown — always renders at body level ──────── */
function LangDropdown({ triggerRef, open, onClose, current, onSelect, isDark }) {
  const [pos, setPos] = useState({});
  const dropRef = useRef(null);   // ref to the portal panel itself

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => {
      const r = triggerRef.current.getBoundingClientRect();
      const dropW = 232;
      let left = r.left;
      if (left + dropW > window.innerWidth - 8) left = window.innerWidth - dropW - 8;
      setPos({ position: "fixed", top: r.bottom + 8, left, width: dropW, zIndex: 2147483647 });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      // Close only if click is outside BOTH the trigger AND the portal panel
      const inTrigger = triggerRef.current?.closest(".gt-wrap")?.contains(e.target);
      const inPanel   = dropRef.current?.contains(e.target);
      if (!inTrigger && !inPanel) onClose();
    };
    // Use mousedown so it fires before click, but we check panel containment
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={dropRef}
      className={`gt-portal-dropdown ${isDark ? "gt-dark" : "gt-light"}`}
      style={pos}
      role="listbox"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`gt-option ${current === l.code ? "gt-option-active" : ""}`}
          role="option"
          aria-selected={current === l.code}
          onMouseDown={(e) => e.stopPropagation()} /* prevent outside-click handler from closing before onClick */
          onClick={() => onSelect(l.code)}
          type="button"
        >
          <span className="gt-flag">{l.flag}</span>
          <span className="gt-option-text">
            <span className="gt-option-native">{l.native}</span>
            <span className="gt-option-label">{l.label}</span>
          </span>
          {current === l.code && <FaCheck className="gt-check-icon" />}
        </button>
      ))}
    </div>,
    document.body
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function GoogleTranslate({ theme }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  // Read from localStorage directly — same source as i18n.js initial lng
  const [currentLang, setCurrentLang] = useState(
    () => localStorage.getItem("ct_lang") || "en"
  );
  const triggerRef = useRef(null);
  const isDark = theme === "dark";

  // Stay in sync whenever i18next changes language (including external calls)
  useEffect(() => {
    const handler = (lng) => {
      const code = lng.split("-")[0];
      setCurrentLang(code);
    };
    i18n.on("languageChanged", handler);
    // Sync immediately in case i18n already has a different language
    if (i18n.language) setCurrentLang(i18n.language.split("-")[0]);
    return () => i18n.off("languageChanged", handler);
  }, [i18n]);

  const selectLang = (code) => {
    setOpen(false);
    localStorage.setItem("ct_lang", code);
    i18n.changeLanguage(code);
  };

  const curLang = LANGS.find((l) => l.code === currentLang) || LANGS[0];

  return (
    <div className={`gt-wrap ${isDark ? "gt-dark" : "gt-light"}`} ref={triggerRef}>
      <button
        className="gt-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FaGlobe className="gt-globe" aria-hidden="true" />
        <span className="gt-current-label">{curLang.label}</span>
        <FaChevronDown
          className="gt-chevron"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <LangDropdown
        triggerRef={triggerRef}
        open={open}
        onClose={() => setOpen(false)}
        current={currentLang}
        onSelect={selectLang}
        isDark={isDark}
      />
    </div>
  );
}
