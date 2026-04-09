const emissionsApp = () => ({
    rows: [
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
        { id: 17, country: "Vereinigtes Koenigreich", company: "Britannia Renewables", sector: "Energie", emissions: 29.5 }
    ],
    filters: {
        country: "",
        company: "",
        sector: "all"
    },
    sort: {
        by: "emissions",
        dir: "desc"
    },
    sanitize(value) {
        let text;
        if (value) {
            text = String(value);
        } else {
            text = "";
        }
        text = text.replace(/[<>]/g, "");
        text = text.trim();
        return text;
    },
    formatEmissions(value) {
        return Number(value).toLocaleString("de-DE", { minimumFractionDigits: 1 });
    },
    toggleSortDir() {
        this.sort.dir = this.sort.dir === "asc" ? "desc" : "asc";
    },
    resetFilters() {
        this.filters = { country: "", company: "", sector: "all" };
        this.sort = { by: "emissions", dir: "desc" };
    },
    get filteredRows() {
        const country = this.sanitize(this.filters.country).toLowerCase();
        const company = this.sanitize(this.filters.company).toLowerCase();
        const sector = this.filters.sector;

        const filtered = this.rows.filter((row) => {
            const matchCountry = !country || row.country.toLowerCase().includes(country);
            const matchCompany = !company || row.company.toLowerCase().includes(company);
            const matchSector = sector === "all" || row.sector === sector;
            return matchCountry && matchCompany && matchSector;
        });

        return filtered.slice().sort((a, b) => { // Sortierung basierend auf dem aktuellen Sortierkriterium und der Richtung
            const left = a[this.sort.by]; // Zugriff auf das zu sortierende Feld
            const right = b[this.sort.by]; // Zugriff auf das zu sortierende Feld
            if (typeof left === "number" && typeof right === "number") { // Numerische Sortierung
                return this.sort.dir === "asc" ? left - right : right - left; // Aufsteigend oder absteigend sortieren
            }
            return this.sort.dir === "asc" // Textuelle Sortierung mit lokaler Sortierung für deutsche Sprache
                ? String(left).localeCompare(String(right), "de") 
                : String(right).localeCompare(String(left), "de");
        });
    }
});

const initDirectionToggle = () => {
    const button = document.getElementById("dirToggle");
    if (!button) return;
}

    const setDir = (dir) => {
        document.documentElement.setAttribute("dir", dir);
        button.textContent = `Schriftkultur: ${dir.toUpperCase()}`;
        button.setAttribute("aria-pressed", dir === "rtl" ? "true" : "false");
    };

    setDir(document.documentElement.getAttribute("dir") || "ltr");

    button.addEventListener("click", function () {
        let current = document.documentElement.getAttribute("dir");

        if (!current) {
            current = "ltr";
        }

        if (current === "rtl") {
            setDir("ltr");
        } else {
            setDir("rtl");
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        initDirectionToggle();
    });