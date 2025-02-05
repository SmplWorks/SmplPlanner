export const THEMES = ["dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

export function initialTheme(): Theme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function deserializeTheme(theme: any): Theme {
    return THEMES.includes(theme as Theme) ? theme as Theme : initialTheme();
}
