/**
 * DevCrate Unified Theme Manager
 * Place this file at: assets/js/Theme.js
 */

(function () {
  "use strict";

  // Apply theme IMMEDIATELY (before DOM loads) to prevent flash
  const themeKey = "devcrate-theme";
  const htmlElement = document.documentElement;

  // Get saved theme or system preference
 function getSavedTheme() {
   try {
     const v = localStorage.getItem(themeKey);
     return v === "dark" || v === "light" ? v : null;
   } catch (e) {
     return null;
   }
 }


  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Apply immediately
  const initialTheme = getSavedTheme() || getSystemTheme();
  if (initialTheme === "dark") {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }

  // Full Theme Manager Class
  class ThemeManager {
    constructor() {
      this.htmlElement = htmlElement;
      this.themeKey = themeKey;
      this.init();
    }

    init() {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      console.log("DevCrate Theme Manager initialized");

      // Update icons based on current theme
      const currentTheme = this.getCurrentTheme();
      this.updateThemeIcons(currentTheme === "dark");

      // Set up all toggle buttons
      this.setupThemeToggles();

      // Listen for system theme changes
      this.listenForSystemThemeChanges();
    }

    getCurrentTheme() {
      return this.htmlElement.classList.contains("dark") ? "dark" : "light";
    }

    // Apply theme: set class and store preference
    applyTheme(theme) {
      // Apply the 'dark' class to <html> (Tailwind needs this)
      this.htmlElement.classList.toggle("dark", theme === "dark");

      // Also set a data attribute for debugging or custom CSS
      this.htmlElement.setAttribute("data-theme", theme);

      // Save the theme preference safely
      try {
        localStorage.setItem(this.themeKey, theme);
      } catch (e) {
        console.warn("Could not save theme preference", e);
      }

      // Update icons, toggle UI, etc.
      // use updateThemeIcons and pass boolean isDark
      this.updateThemeIcons(theme === "dark");
    }

    updateThemeIcons(isDark) {
      // Update moon icons (show in light mode, hide in dark mode)
      document.querySelectorAll("#moonIcon, .moon-icon").forEach((icon) => {
        icon.classList.toggle("hidden", isDark);
      });

      // Update sun icons (hide in light mode, show in dark mode)
      document.querySelectorAll("#sunIcon, .sun-icon").forEach((icon) => {
        icon.classList.toggle("hidden", !isDark);
      });
    }

    toggleTheme() {
      const currentTheme = this.getCurrentTheme();
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      this.applyTheme(newTheme);
    }

    setupThemeToggles() {
      const toggleButtons = document.querySelectorAll(
        "#themeToggle, .theme-toggle, [data-theme-toggle]"
      );

      console.log(`Found ${toggleButtons.length} theme toggle button(s)`);

      toggleButtons.forEach((button) => {
        // Remove old listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // Add click listener
        newButton.addEventListener("click", (e) => {
          e.preventDefault();
          this.toggleTheme();
        });

        // Keyboard support
        newButton.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.toggleTheme();
          }
        });

        // Accessibility
        newButton.setAttribute("role", "button");
        newButton.setAttribute("tabindex", "0");
        if (!newButton.getAttribute("aria-label")) {
          newButton.setAttribute("aria-label", "Toggle dark mode");
        }
      });
    }

    listenForSystemThemeChanges() {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handler = (e) => {
        // Only auto-switch if user hasn't set a preference
        if (!getSavedTheme()) {
          const newTheme = e.matches ? "dark" : "light";
          this.applyTheme(newTheme);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handler);
      }
    }

    setTheme(theme) {
      if (theme === "dark" || theme === "light") {
        this.applyTheme(theme);
      } else {
        console.warn('Invalid theme. Use "light" or "dark"');
      }
    }

    resetToSystemPreference() {
      try {
        localStorage.removeItem(this.themeKey);
      } catch (e) {}
      const systemTheme = getSystemTheme();
      this.applyTheme(systemTheme);
    }
  }

  // Initialize theme manager
  const themeManager = new ThemeManager();

  // Export globally
  window.DevCrateTheme = themeManager;
})();
