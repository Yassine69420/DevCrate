/**
 * DevCrate Unified Theme Manager
 * This file handles theme switching across all pages
 */

class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.themeKey = "devcrate-theme";
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Apply saved theme or system preference immediately
    this.applyInitialTheme();

    // Set up theme toggle buttons
    this.setupThemeToggles();

    // Listen for system theme changes
    this.listenForSystemThemeChanges();
  }

  applyInitialTheme() {
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      const systemPreference = this.getSystemThemePreference();
      this.applyTheme(systemPreference);
    }
  }

  getSavedTheme() {
    try {
      return localStorage.getItem(this.themeKey);
    } catch (e) {
      console.warn(
        "localStorage not available, falling back to system preference"
      );
      return null;
    }
  }

  getSystemThemePreference() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(theme) {
    const isDark = theme === "dark";

    // Apply dark class to html element
    this.htmlElement.classList.toggle("dark", isDark);

    // Update all theme toggle buttons
    this.updateThemeIcons(isDark);

    // Save theme preference
    this.saveTheme(theme);
  }

  updateThemeIcons(isDark) {
    // Find all theme toggle elements
    const moonIcons = document.querySelectorAll("#moonIcon, .moon-icon");
    const sunIcons = document.querySelectorAll("#sunIcon, .sun-icon");

    moonIcons.forEach((icon) => {
      if (icon) {
        icon.classList.toggle("hidden", isDark);
      }
    });

    sunIcons.forEach((icon) => {
      if (icon) {
        icon.classList.toggle("hidden", !isDark);
      }
    });
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.themeKey, theme);
    } catch (e) {
      console.warn("Could not save theme preference to localStorage");
    }
  }

  toggleTheme() {
    const currentTheme = this.htmlElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }

  setupThemeToggles() {
    // Find all theme toggle buttons
    const themeToggles = document.querySelectorAll(
      "#themeToggle, .theme-toggle"
    );

    themeToggles.forEach((button) => {
      // Remove existing listeners to prevent duplicates
      button.removeEventListener("click", this.handleToggleClick);

      // Add click listener
      button.addEventListener("click", this.handleToggleClick.bind(this));

      // Add keyboard support
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTheme();
        }
      });

      // Ensure button has proper accessibility attributes
      button.setAttribute("role", "button");
      button.setAttribute("aria-label", "Toggle dark mode");
    });
  }

  handleToggleClick(event) {
    event.preventDefault();
    this.toggleTheme();
  }

  listenForSystemThemeChanges() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      // Only auto-switch if no manual preference is saved
      const savedTheme = this.getSavedTheme();
      if (!savedTheme) {
        const newTheme = e.matches ? "dark" : "light";
        this.applyTheme(newTheme);
      }
    });
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.htmlElement.classList.contains("dark") ? "dark" : "light";
  }

  // Public method to set theme programmatically
  setTheme(theme) {
    if (theme === "dark" || theme === "light") {
      this.applyTheme(theme);
    } else {
      console.warn('Invalid theme. Use "light" or "dark"');
    }
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other scripts if needed
window.DevCrateTheme = themeManager;
