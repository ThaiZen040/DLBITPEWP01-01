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
