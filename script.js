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
  { id: 15, country: "Südafrika", company: "Cape Cement", sector: "Industrie", emissions: 48.9 },
  { id: 16, country: "Norwegen", company: "Arctic Shipping", sector: "Transport", emissions: 15.4 },
  { id: 17, country: "Vereinigtes Königreich", company: "Britannia Renewables", sector: "Energie", emissions: 29.5 },
  { id: 18, country: "Thailand", company: "Siam Transport", sector: "Transport", emissions: 27.8 },
  { id: 19, country: "China", company: "Pearl River Manufacturing", sector: "Industrie", emissions: 34.7 },
  { id: 20, country: "Japan", company: "Shinkai Agriculture", sector: "Landwirtschaft", emissions: 12.3 },
  { id: 21, country: "Indien", company: "Ganga Textiles", sector: "Industrie", emissions: 400.5 },
  { id: 22, country: "Thailand", company: "Siam Tech", sector: "Technologie", emissions: 27.8 },
]);

const SAFE_DIRECTIONS = new Set(["ltr", "rtl"]); // Funktion für sichere Richtungswerte, um Missbrauch zu verhindern.
const RTL_LANGUAGE_PREFIXES = ["ar", "dv", "fa", "he", "ku", "ps", "sd", "ug", "ur", "yi"]; // Liste von Sprachpräfixen, die typischerweise von rechts nach links gelesen werden.

function sanitizeTextInput(value) { // Funktion zur Bereinigung von Texteingaben, um potenzielle Sicherheitsrisiken zu minimieren.
  let text; 

  if (value) { // Überprüfen, ob der Wert definiert und nicht leer ist, bevor er in einen String umgewandelt wird.
    text = String(value);
  } else {
    text = "";
  }

  text = text.replace(/[<>]/g, ""); // Entfernen von spitzen Klammern, um die Möglichkeit von HTML-Injektionen zu reduzieren.
  text = text.trim(); // Entfernen von führenden und nachfolgenden Leerzeichen, um die Eingabe zu normalisieren.

  return text;
}

function normalizeInput(value) { // Funktion zur Normalisierung von Eingaben, um eine konsistente Verarbeitung zu gewährleisten.
  return sanitizeTextInput(value).toLocaleLowerCase("de-DE");
}

function isRtlLocale(locale) { // Funktion zur Überprüfung, ob eine gegebene Sprache typischerweise von rechts nach links gelesen wird, basierend auf bekannten Sprachpräfixen.
  const normalizedLocale = locale.toLocaleLowerCase();

  return RTL_LANGUAGE_PREFIXES.some((prefix) => { // Überprüfen, ob der normalisierte Sprachcode mit einem der RTL-Präfixe übereinstimmt oder mit einem Bindestrich gefolgt von weiteren Informationen beginnt (z.B. "ar-EG").
    return normalizedLocale === prefix || normalizedLocale.startsWith(`${prefix}-`);
  });
}

function detectPreferredDirection() { // Funktion zur Erkennung der bevorzugten Schreibrichtung basierend auf den Spracheinstellungen des Browsers.
  const locales = Array.isArray(navigator.languages) && navigator.languages.length > 0
    ? navigator.languages // Wenn navigator.languages verfügbar und nicht leer ist, verwenden wir diese Liste von Sprachen.
    : [navigator.language].filter(Boolean); // Ansonsten verwenden wir navigator.language, falls es definiert ist, und filtern falsy Werte heraus.

  if (locales.some(isRtlLocale)) { // Wenn eine der erkannten Sprachen eine RTL-Sprache ist, geben wir "rtl" zurück.
    return "rtl";
  }

  return "ltr";
}

function getStoredDirection() { // Funktion zum Abrufen der gespeicherten Schreibrichtung aus localStorage, mit Fehlerbehandlung für den Fall, dass localStorage nicht verfügbar ist oder ungültige Daten enthält.
  try {
    const storedDirection = localStorage.getItem("co2-atlas-direction"); // Versuchen, die gespeicherte Schreibrichtung abzurufen.

    if (SAFE_DIRECTIONS.has(storedDirection)) { // Überprüfen, ob der abgerufene Wert eine gültige Schreibrichtung ist, bevor er zurückgegeben wird.
      return storedDirection;
    }
  } catch {
    // localStorage is optional.
  }

  return null;
}

function storeDirection(direction) { // Funktion zum Speichern der aktuellen Schreibrichtung in localStorage, mit Fehlerbehandlung für den Fall, dass localStorage nicht verfügbar ist.
  try {
    localStorage.setItem("co2-atlas-direction", direction); // Versuchen, die aktuelle Schreibrichtung zu speichern.
  } catch {
    // localStorage is optional.
  }
}

function applyDirection(direction) { // Funktion zur Anwendung der angegebenen Schreibrichtung auf das Dokument, mit Sicherheitsüberprüfung und Aktualisierung des Toggle-Buttons.
  const safeDirection = SAFE_DIRECTIONS.has(direction) ? direction : "ltr"; //  Überprüfen, ob die angegebene Schreibrichtung gültig ist, und andernfalls auf "ltr" zurücksetzen, um Missbrauch zu verhindern.
  const button = document.getElementById("dirToggle"); // Abrufen des Toggle-Buttons, um dessen Zustand entsprechend der aktuellen Schreibrichtung zu aktualisieren.

  document.documentElement.setAttribute("dir", safeDirection); // Anwenden der sicheren Schreibrichtung auf das HTML-Element, um die Schreibrichtung der gesamten Seite zu steuern.

  if (button) {
    button.textContent = `Schriftkultur: ${safeDirection.toUpperCase()}`; // Aktualisieren des Textinhalts des Toggle-Buttons, um die aktuelle Schreibrichtung anzuzeigen.
    button.setAttribute("aria-pressed", safeDirection === "rtl" ? "true" : "false");
  }

  storeDirection(safeDirection); // Speichern der aktuellen Schreibrichtung, damit sie bei zukünftigen Besuchen der Seite beibehalten wird.
}

function initDirectionToggle() { // Funktion zur Initialisierung des Schreibrichtungstoggles, die die aktuelle Schreibrichtung anwendet und einen Event-Listener für den Toggle-Button hinzufügt.
  const button = document.getElementById("dirToggle");

  if (!button) {
    return;
  }

  applyDirection(getStoredDirection() || detectPreferredDirection()); // Anwenden der gespeicherten Schreibrichtung oder, falls keine gespeichert ist, der bevorzugten Schreibrichtung des Benutzers.

  button.addEventListener("click", () => { // Hinzufügen eines Klick-Event-Listeners zum Toggle-Button, der die Schreibrichtung zwischen "ltr" und "rtl" wechselt, wenn der Button geklickt wird.
    const current = document.documentElement.getAttribute("dir") || "ltr";

    if (current === "rtl") {
      applyDirection("ltr");
    } else {
      applyDirection("rtl");
    }
  });
}

document.addEventListener("DOMContentLoaded", initDirectionToggle);

document.addEventListener("alpine:init", () => { // Initialisierung der Alpine.js-Komponente "emissionsApp", die die Logik für die Filterung, Sortierung und Anzeige der Emissionsdaten enthält.
  Alpine.data("emissionsApp", () => ({
    rows: emissionsRows,
    countryQuery: "",
    companyQuery: "",
    selectedSector: "all",
    sortBy: "emissions",
    sortDir: "desc",
 
    formatEmissions(value) { // Funktion zur Formatierung der Emissionswerte mit einem Dezimalpunkt und einem Tausendertrennzeichen, um die Lesbarkeit zu verbessern.
      return Number(value).toLocaleString("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    },

    toggleSortDir() { // Funktion zum Umschalten der Sortierrichtung zwischen "asc" (aufsteigend) und "desc" (absteigend), um die Sortierung der Daten zu steuern.
      if (this.sortDir === "asc") {
        this.sortDir = "desc";
      } else {
        this.sortDir = "asc";
      }
    },

    resetFilters() { // Funktion zum Zurücksetzen aller Filter- und Sortieroptionen auf ihre Standardwerte, um die ursprüngliche Ansicht der Daten wiederherzustellen.  
      this.countryQuery = "";
      this.companyQuery = "";
      this.selectedSector = "all";
      this.sortBy = "emissions";
      this.sortDir = "desc";
    },

    get filteredRows() { // Berechnete Eigenschaft, die die Zeilen basierend auf den aktuellen Filter- und Sortieroptionen filtert und sortiert, um die angezeigten Daten zu steuern.
      const country = normalizeInput(this.countryQuery); // Normalisieren der Ländereingabe, um eine konsistente Filterung zu ermöglichen, unabhängig von Groß- und Kleinschreibung oder zusätzlichen Leerzeichen.
      const company = normalizeInput(this.companyQuery);
      const sector = this.selectedSector;

      const filtered = this.rows.filter((row) => { // Filtern der Zeilen basierend auf den eingegebenen Suchbegriffen für Land und Unternehmen sowie der ausgewählten Branche, um nur die relevanten Daten anzuzeigen.
        const matchCountry = !country || row.country.toLocaleLowerCase("de-DE").includes(country); // Überprüfen, ob die Ländereingabe leer ist oder ob der Ländername der Zeile die eingegebene Suche enthält, um eine flexible Filterung zu ermöglichen.
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
