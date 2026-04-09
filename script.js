//Die Funktion macht einen Button, mit dem man die Schreibrichtung der Seite umschalten kann:
const initDirectionToggle = () => {
    const button = document.getElementById("dirToggle"); // Hole den Button mit der ID "dirToggle"
    if (!button) return; // Wenn der Button nicht gefunden wird, beende die Funktion

    const setDir = (dir) => { // Funktion zum Setzen der Schreibrichtung:
        document.documentElement.setAttribute("dir", dir);
        button.textContent = `Schriftkultur: ${dir.toUpperCase()}`;

        if (dir === "rtl") { // Wenn die Schreibrichtung "rtl" ist, setze aria-pressed auf true, sonst auf false:
            button.setAttribute("aria-pressed", "true");
        } else {
            button.setAttribute("aria-pressed", "false");
        }
    };
    // Setze die Anfangsschreibrichtung basierend auf dem aktuellen Attribut oder Standard auf "ltr":
    setDir(document.documentElement.getAttribute("dir") || "ltr");
    // Event-Listener für den Button, um die Schreibrichtung zu wechseln:
    button.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("dir") || "ltr";
        // Wechsle die Schreibrichtung:
        if (current === "rtl") {
            setDir("ltr");
        } else {
            setDir("rtl");
        }
    });
};

// Initialisiere die Schreibrichtungstoggle-Funktion, wenn das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    initDirectionToggle();
});

// Die Funktion emissionsApp definiert die Daten und Filter für die Emissionen der Unternehmen:
const emissionsApp = () => ({
    rows: [ // Hier sind die Daten der Unternehmen mit ihren Emissionen:
        { id: 1, country: "Deutschland", company: "NordWind Energie", sector: "Energie", emissions: 82.4 },
        { id: 2, country: "Deutschland", company: "RheinMetallurgy", sector: "Industrie", emissions: 45.2 },
        { id: 3, country: "Deutschland", company: "AutoMobil AG", sector: "Transport", emissions: 60.1 },
        { id: 4, country: "USA", company: "Eagle Oil", sector: "Energie", emissions: 120.5 },
        { id: 5, country: "USA", company: "Liberty Steel", sector: "Industrie", emissions: 78.3 },
        { id: 6, country: "USA", company: "Freedom Transport", sector: "Transport", emissions: 55.7 },
        { id: 7, country: "Thailand", company: "Siam Energy", sector: "Energie", emissions: 95.2 },
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

    // Die Filter für die Daten:
    filters: {
        country: "",
        company: "",
        sector: "all"
    },
    // Funktion zum Zurücksetzen der Filter:
    resetFilters() {
        this.filters = { country: "", company: "", sector: "all" };
        this.sort = { by: "emissions", dir: "desc" };
    },
    // Die Sortierung der Daten:
    sort: {
        by: "emissions",
        dir: "desc"
    },

})
