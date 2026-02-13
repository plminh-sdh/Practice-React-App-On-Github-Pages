import type { Option } from "../../../models/option";

export const FontOptions: Option[] = [
  // --- Generic / safest ---
  { displayValue: "System UI", value: "system-ui" },
  { displayValue: "Sans-serif (generic)", value: "sans-serif" },
  { displayValue: "Serif (generic)", value: "serif" },
  { displayValue: "Monospace (generic)", value: "monospace" },

  // --- Windows common ---
  { displayValue: "Segoe UI (Windows)", value: "'Segoe UI', sans-serif" },
  { displayValue: "Arial", value: "Arial, Helvetica, sans-serif" },
  { displayValue: "Tahoma", value: "Tahoma, sans-serif" },
  { displayValue: "Verdana", value: "Verdana, sans-serif" },
  { displayValue: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { displayValue: "Consolas", value: "Consolas, 'Courier New', monospace" },

  // --- macOS common ---
  { displayValue: "San Francisco (macOS)", value: "-apple-system, system-ui, sans-serif" },
  { displayValue: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { displayValue: "Helvetica Neue", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { displayValue: "Menlo", value: "Menlo, Monaco, monospace" },

  // --- Linux common ---
  { displayValue: "Ubuntu", value: "Ubuntu, sans-serif" },
  { displayValue: "DejaVu Sans", value: "'DejaVu Sans', sans-serif" },
  { displayValue: "Liberation Sans", value: "'Liberation Sans', sans-serif" },
  { displayValue: "Noto Sans", value: "'Noto Sans', sans-serif" },
  { displayValue: "Noto Serif", value: "'Noto Serif', serif" },

  // --- Vietnamese-friendly (best if you LOAD them) ---
  { displayValue: "Be Vietnam Pro 🇻🇳", value: "'Be Vietnam Pro', sans-serif" },
  { displayValue: "Roboto", value: "'Roboto', sans-serif" },
  { displayValue: "Inter", value: "'Inter', sans-serif" },
  { displayValue: "Open Sans", value: "'Open Sans', sans-serif" },
  { displayValue: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
  { displayValue: "Montserrat", value: "'Montserrat', sans-serif" },
  { displayValue: "Lato", value: "'Lato', sans-serif" },
  { displayValue: "Nunito", value: "'Nunito', sans-serif" },

  // --- Monospace (best if you LOAD them) ---
  { displayValue: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { displayValue: "Fira Code", value: "'Fira Code', monospace" },
  { displayValue: "Source Code Pro", value: "'Source Code Pro', monospace" },

  
  { displayValue: "Helvetical", value: "Helvetical"},
];