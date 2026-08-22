export type ThemeMode = "cosmic" | "obsidian" | "cyber" | "light";
export type FontSizeScale = "compact" | "normal" | "large";

export interface AppearanceConfig {
  theme: ThemeMode;
  particles: boolean;
  fontSize: FontSizeScale;
}

export const DEFAULT_APPEARANCE: AppearanceConfig = {
  theme: "cosmic",
  particles: true,
  fontSize: "normal",
};

export function getStoredAppearance(): AppearanceConfig {
  if (typeof window === "undefined") return DEFAULT_APPEARANCE;
  try {
    const theme = (localStorage.getItem("edith_theme") as ThemeMode) || "cosmic";
    const particles = localStorage.getItem("edith_particles") !== "false";
    const fontSize = (localStorage.getItem("edith_font_size") as FontSizeScale) || "normal";
    return { theme, particles, fontSize };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function applyAppearance(config: Partial<AppearanceConfig>): AppearanceConfig {
  const current = getStoredAppearance();
  const updated: AppearanceConfig = {
    theme: config.theme ?? current.theme,
    particles: config.particles ?? current.particles,
    fontSize: config.fontSize ?? current.fontSize,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("edith_theme", updated.theme);
      localStorage.setItem("edith_particles", String(updated.particles));
      localStorage.setItem("edith_font_size", updated.fontSize);

      // Apply data attributes to HTML root and body for immediate CSS cascade
      const root = document.documentElement;
      const body = document.body;

      root.setAttribute("data-theme", updated.theme);
      body.setAttribute("data-theme", updated.theme);

      root.setAttribute("data-font-size", updated.fontSize);
      root.setAttribute("data-particles", String(updated.particles));

      // Broadcast custom event so all active components react instantly
      window.dispatchEvent(new CustomEvent("edith-appearance-change", { detail: updated }));
    } catch (e) {
      console.warn("Error applying appearance:", e);
    }
  }

  return updated;
}
