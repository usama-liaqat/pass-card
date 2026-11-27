/** Color math for card themes (WCAG relative luminance and contrast). */

export type Rgb = [number, number, number];

/** "#C8102E" or "#fff" → [200, 16, 46]. Invalid input reads as black. */
export const hexToRgb = (hex: string): Rgb => {
    let value = String(hex || "#000000").replace("#", "");
    if (value.length === 3) value = [...value].map(digit => digit + digit).join("");
    const n = Number.parseInt(value, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgbToHex = (rgb: Rgb): string =>
    `#${rgb
        .map(v =>
            Math.max(0, Math.min(255, Math.round(v)))
                .toString(16)
                .padStart(2, "0")
        )
        .join("")}`.toUpperCase();

export const luminance = (hex: string): number => {
    const [r, g, b] = hexToRgb(hex).map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio, 1–21. */
export const contrastRatio = (a: string, b: string): number => {
    const x = luminance(a);
    const y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/** White or near-black text, whichever reads better on `background`. */
export const readableOn = (background: string): string =>
    contrastRatio(background, "#FFFFFF") >= 3.1 ? "#FFFFFF" : "#141416";

/** Mixes `fg` over `bg` at `alpha` (0–1) and returns a solid hex color. */
export const blend = (fg: string, bg: string, alpha: number): string => {
    const f = hexToRgb(fg);
    const b = hexToRgb(bg);
    return rgbToHex([0, 1, 2].map(i => f[i] * alpha + b[i] * (1 - alpha)) as Rgb);
};
