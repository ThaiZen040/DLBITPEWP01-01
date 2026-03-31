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

const emissionsdata = {
    "Germany": 800,
    "USA": 5000,
    "China": 10000,
    "India": 3000,
    "Russia": 2000
};  

