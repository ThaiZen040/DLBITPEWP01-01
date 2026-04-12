const emissionsRows = Object.freeze([
  { id: 1, country: "Deutschland", company: "NordWind Energie", sector: "Energie", emissions: 82.4 },
  { id: 2, country: "Deutschland", company: "RheinMetallurgy", sector: "Industrie", emissions: 45.2 },
  { id: 3, country: "Frankreich", company: "Lumiere Logistics", sector: "Transport", emissions: 31.7 },
  { id: 4, country: "Italien", company: "Mediterraneo Cement", sector: "Industrie", emissions: 56.3 },
  { id: 5, country: "Spanien", company: "Solaria Foods", sector: "Landwirtschaft", emissions: 18.9 },
  { id: 6, country: "USA", company: "Pacific Grid", sector: "Energie", emissions: 120.5 },
  { id: 7, country: "USA", company: "Great Plains Freight", sector: "Transport", emissions: 74.1 },
  { id: 8, country: "Kanada", company: "Boreal Mining", sector: "Industrie", emissions: 63.8 },
  { id: 9, country: "Brasilien", company: "Amazonia Agro", sector: "Landwirtschaft", emissions: 52.6 },
  { id: 10, country: "Indien", company: "Ganga Power", sector: "Energie", emissions: 138.9 },
  { id: 11, country: "Japan", company: "Shinkai Steel", sector: "Industrie", emissions: 67.4 },
  { id: 12, country: "Suedkorea", company: "Haneul Tech", sector: "Technologie", emissions: 22.2 },
  { id: 13, country: "China", company: "Pearl River Manufacturing", sector: "Industrie", emissions: 210.3 },
  { id: 14, country: "Australien", company: "Southern LNG", sector: "Energie", emissions: 91.6 },
  { id: 15, country: "Suedafrika", company: "Cape Cement", sector: "Industrie", emissions: 48.9 },
  { id: 16, country: "Norwegen", company: "Arctic Shipping", sector: "Transport", emissions: 15.4 },
  { id: 17, country: "Vereinigtes Koenigreich", company: "Britannia Renewables", sector: "Energie", emissions: 29.5 },
]);

const SAFE_DIRECTIONS = new Set(["ltr", "rtl"]);
const RTL_LANGUAGE_PREFIXES = ["ar", "dv", "fa", "he", "ku", "ps", "sd", "ug", "ur", "yi"];

function sanitizeTextInput(value) {
  let text;

  if (value) {
    text = String(value);
  } else {
    text = "";
  }

  text = text.replace(/[<>]/g, "");
  text = text.trim();

  return text;
}

function normalizeInput(value) {
  return sanitizeTextInput(value).toLocaleLowerCase("de-DE");
}

function isRtlLocale(locale) {
  const normalizedLocale = locale.toLocaleLowerCase();

  return RTL_LANGUAGE_PREFIXES.some((prefix) => {
    return normalizedLocale === prefix || normalizedLocale.startsWith(`${prefix}-`);
  });
}

function detectPreferredDirection() {
  const locales = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language].filter(Boolean);

  if (locales.some(isRtlLocale)) {
    return "rtl";
  }

  return "ltr";
}

function getStoredDirection() {
  try {
    const storedDirection = localStorage.getItem("co2-atlas-direction");

    if (SAFE_DIRECTIONS.has(storedDirection)) {
      return storedDirection;
    }
  } catch {
    // localStorage is optional.
  }

  return null;
}

function storeDirection(direction) {
  try {
    localStorage.setItem("co2-atlas-direction", direction);
  } catch {
    // localStorage is optional.
  }
}

function applyDirection(direction) {
  const safeDirection = SAFE_DIRECTIONS.has(direction) ? direction : "ltr";
  const button = document.getElementById("dirToggle");

  document.documentElement.setAttribute("dir", safeDirection);

  if (button) {
    button.textContent = `Schriftkultur: ${safeDirection.toUpperCase()}`;
    button.setAttribute("aria-pressed", safeDirection === "rtl" ? "true" : "false");
  }

  storeDirection(safeDirection);
}

function initDirectionToggle() {
  const button = document.getElementById("dirToggle");

  if (!button) {
    return;
  }

  applyDirection(getStoredDirection() || detectPreferredDirection());

  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("dir") || "ltr";

    if (current === "rtl") {
      applyDirection("ltr");
    } else {
      applyDirection("rtl");
    }
  });
}

document.addEventListener("DOMContentLoaded", initDirectionToggle);

document.addEventListener("alpine:init", () => {
  Alpine.data("emissionsApp", () => ({
    rows: emissionsRows,
    countryQuery: "",
    companyQuery: "",
    selectedSector: "all",
    sortBy: "emissions",
    sortDir: "desc",

    formatEmissions(value) {
      return Number(value).toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    },

    toggleSortDir() {
      if (this.sortDir === "asc") {
        this.sortDir = "desc";
      } else {
        this.sortDir = "asc";
      }
    },

    resetFilters() {
      this.countryQuery = "";
      this.companyQuery = "";
      this.selectedSector = "all";
      this.sortBy = "emissions";
      this.sortDir = "desc";
    },

    get filteredRows() {
      const country = normalizeInput(this.countryQuery);
      const company = normalizeInput(this.companyQuery);
      const sector = this.selectedSector;

      const filtered = this.rows.filter((row) => {
        const matchCountry = !country || row.country.toLocaleLowerCase("de-DE").includes(country);
        const matchCompany = !company || row.company.toLocaleLowerCase("de-DE").includes(company);
        const matchSector = sector === "all" || row.sector === sector;

        return matchCountry && matchCompany && matchSector;
      });

      return filtered.slice().sort((a, b) => {
        const left = a[this.sortBy];
        const right = b[this.sortBy];

        if (typeof left === "number" && typeof right === "number") {
          if (this.sortDir === "asc") {
            return left - right;
          }

          return right - left;
        }

        if (this.sortDir === "asc") {
          return String(left).localeCompare(String(right), "de");
        }

        return String(right).localeCompare(String(left), "de");
      });
    },

    get resultCount() {
      return this.filteredRows.length;
    },

    get hasNoResults() {
      return this.filteredRows.length === 0;
    },

    get sortDirectionLabel() {
      if (this.sortDir === "asc") {
        return "aufsteigend";
      }

      return "absteigend";
    },
  }));
});
