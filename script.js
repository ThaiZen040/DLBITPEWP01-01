//Die Funktion macht einen Button, mit dem man die Schreibrichtung der Seite umschalten kann:
const initDirectionToggle = () => {
    const button = document.getElementById("dirToggle");
    if (!button) return;

    const setDir = (dir) => {
        document.documentElement.setAttribute("dir", dir);
        button.textContent = `Schriftkultur: ${dir.toUpperCase()}`;

        if (dir === "rtl") {
            button.setAttribute("aria-pressed", "true");
        } else {
            button.setAttribute("aria-pressed", "false");
        }
    };

    setDir(document.documentElement.getAttribute("dir") || "ltr");

    button.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("dir") || "ltr";

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

const emissionsApp = () => ({
    rows: [
        { id: 1, country: "Deutschland", company: "NordWind Energie", sector: "Energie", emissions: 82.4 },

    ],
    filters: {
        country: "",
        company: "",
        sector: "all"
    },
})