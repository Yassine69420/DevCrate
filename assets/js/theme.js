document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    const applyTheme = (theme) => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Dispatch a custom event to notify other scripts of the theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };

    // Apply saved theme on initial load
    const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isDark = document.documentElement.classList.toggle("dark");
            const newTheme = isDark ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            // The class is already toggled, but we dispatch the event
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    }
});
