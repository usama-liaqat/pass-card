import type { WalletCardData, WalletField, WalletPlatform } from "../components/ui";
import { generateQr } from "./qr";
import { loadQrEngine } from "./qrEngine";

/*
 * Draws a wallet card as an image (PNG/JPEG via canvas, or SVG markup) at 2×
 * the preview size, entirely in the browser. Layout follows drawPass and
 * svgPass on the design canvas.
 */

export type PassImageFormat = "png" | "jpeg" | "svg";

const FONT = '"Inter Variable", Inter, -apple-system, system-ui, sans-serif';
const WIDTH = 720;
const APPLE_MAX_FIELDS = 4;
const QR_PANEL_BG = "#FFFFFF";
const QR_DARK = "#000000";
const QR_CAPTION = "#3A3A40";

interface Layout {
    google: boolean;
    width: number;
    height: number;
    qrBox: number;
}

const layoutFor = (card: WalletCardData, platform: WalletPlatform): Layout => {
    const google = platform === "google";
    const qrBox = card.qrSizeApple ? Math.min(380, Math.round(card.qrSizeApple * 2)) : 300;
    const height = card.qr ? (google ? 1060 : 1000) + (qrBox - 300) : google ? 740 : 700;
    return { google, width: WIDTH, height, qrBox };
};

const appleFieldRows = (card: WalletCardData): Array<Array<WalletField>> => {
    const secondary = (card.secondary ?? []).slice(0, APPLE_MAX_FIELDS);
    const auxiliary = (card.auxiliary ?? []).slice(0, APPLE_MAX_FIELDS - secondary.length);
    return [secondary, auxiliary].filter(row => row.length > 0);
};

const hasLogoTile = (card: WalletCardData) => card.logo.kind !== "image" || Boolean(card.logo.src);

/** The QR path (in module units, quiet zone included), or null when there is nothing to draw. */
const qrPathFor = async (card: WalletCardData): Promise<{ path: string; size: number } | null> => {
    if (!card.qr || card.qr.imageSrc || card.qr.pending || !card.qr.value) return null;
    const result = generateQr(await loadQrEngine(), card.qr.value);
    return result.status === "ok" ? { path: result.path, size: result.size } : null;
};

/* ---------- Canvas (PNG / JPEG) ---------- */

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
};

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
    new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });

const drawContained = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
) => {
    const scale = Math.min(w / image.width, h / image.height);
    const dw = image.width * scale;
    const dh = image.height * scale;
    ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
};

/** Renders the card to a canvas. JPEG gets a white background behind the rounded corners. */
export const drawPassCanvas = async (
    card: WalletCardData,
    platform: WalletPlatform,
    jpeg: boolean
): Promise<HTMLCanvasElement> => {
    const { google, width: W, height: H, qrBox } = layoutFor(card, platform);
    const [logo, qrImage, qr] = await Promise.all([
        card.logo.kind === "image" && card.logo.src ? loadImage(card.logo.src) : Promise.resolve(null),
        card.qr?.imageSrc ? loadImage(card.qr.imageSrc) : Promise.resolve(null),
        qrPathFor(card),
        document.fonts.ready
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas isn’t available in this browser");
    const { theme } = card;
    const fg = google ? theme.googleFg : theme.fg;
    const label = google ? theme.googleLabel : theme.label;

    if (jpeg) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, W, H);
    }
    roundRect(ctx, 0, 0, W, H, google ? 48 : 32);
    ctx.fillStyle = theme.bg;
    ctx.fill();
    if (theme.border && theme.border !== "transparent") {
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Logo tile + issuer name
    let textX = 32;
    if (hasLogoTile(card)) {
        ctx.save();
        roundRect(ctx, 32, 30, 64, 64, google ? 32 : 16);
        ctx.clip();
        ctx.fillStyle = logo ? "#FFFFFF" : theme.tileBg;
        ctx.fillRect(32, 30, 64, 64);
        if (logo) drawContained(ctx, logo, 36, 34, 56, 56);
        else if (card.logo.kind === "mono" || card.logo.kind === "text") {
            ctx.fillStyle = theme.tileFg;
            const text = card.logo.text;
            ctx.font = `700 ${card.logo.kind === "text" ? 22 : text.length > 2 ? 21 : 26}px ${FONT}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, 64, 63);
        }
        ctx.restore();
        textX = 116;
    }
    const showHeader = Boolean(card.header) && !google;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fg;
    ctx.font = `${google ? "500 30px" : "600 32px"} ${FONT}`;
    ctx.fillText(card.title, textX, 63, W - textX - (showHeader ? 200 : 40));
    if (showHeader && card.header) {
        ctx.textAlign = "right";
        ctx.fillStyle = label;
        ctx.font = `600 20px ${FONT}`;
        ctx.fillText(card.header.label.toUpperCase(), W - 32, 46);
        ctx.fillStyle = fg;
        ctx.font = `500 30px ${FONT}`;
        ctx.fillText(card.header.value, W - 32, 80);
        ctx.textAlign = "left";
    }
    ctx.textBaseline = "alphabetic";

    if (!google) {
        const primarySize = (card.primary.size ?? 24) * 2;
        let y = 168;
        if (card.primary.label) {
            ctx.fillStyle = label;
            ctx.font = `600 21px ${FONT}`;
            ctx.fillText(card.primary.label.toUpperCase(), 32, y);
            y += 12;
        }
        ctx.fillStyle = fg;
        ctx.font = `500 ${primarySize}px ${FONT}`;
        ctx.fillText(card.primary.value, 32, y + primarySize, W - 64);

        let rowY = 300;
        for (const row of appleFieldRows(card)) {
            for (const field of row) {
                const right = field.align === "right";
                const x = right ? W - 32 : 32;
                const maxWidth = row.length > 1 ? (W - 64) / 2 - 12 : W - 64;
                ctx.textAlign = right ? "right" : "left";
                ctx.fillStyle = label;
                ctx.font = `600 21px ${FONT}`;
                ctx.fillText(field.label.toUpperCase(), x, rowY, maxWidth);
                ctx.fillStyle = fg;
                ctx.font = `500 ${(field.size ?? 15) * 2}px ${FONT}`;
                ctx.fillText(field.value, x, rowY + 40, maxWidth);
            }
            ctx.textAlign = "left";
            rowY += 112;
        }
    } else {
        const primarySize = (card.primary.googleSize ?? 24) * 2;
        const y = 160;
        ctx.fillStyle = label;
        ctx.font = `400 26px ${FONT}`;
        ctx.fillText(card.googleSubheader ?? "", 36, y, W - 72);
        ctx.fillStyle = fg;
        ctx.font = `500 ${primarySize}px ${FONT}`;
        ctx.fillText(card.primary.value, 36, y + primarySize + 10, W - 72);
        let rowY = y + primarySize + 92;
        for (const row of card.googleRows ?? []) {
            const cellWidth = (W - 72) / row.cells.length;
            row.cells.forEach((cell, index) => {
                const x = 36 + index * cellWidth;
                ctx.fillStyle = label;
                ctx.font = `400 24px ${FONT}`;
                ctx.fillText(cell.label, x, rowY, cellWidth - 16);
                ctx.fillStyle = fg;
                ctx.font = `500 ${(cell.size ?? 15) * 2}px ${FONT}`;
                ctx.fillText(cell.value, x, rowY + 40, cellWidth - 16);
            });
            rowY += 100;
        }
    }

    if (card.qr) {
        const bx = (W - qrBox) / 2;
        const by = H - qrBox - 92;
        roundRect(ctx, bx, by, qrBox, qrBox + 48, 24);
        ctx.fillStyle = QR_PANEL_BG;
        ctx.fill();
        if (qrImage) drawContained(ctx, qrImage, bx + 22, by + 22, qrBox - 44, qrBox - 44);
        else if (qr) {
            const cell = (qrBox - 24) / qr.size;
            ctx.save();
            ctx.translate(bx + 12, by + 12);
            ctx.scale(cell, cell);
            ctx.fillStyle = QR_DARK;
            ctx.fill(new Path2D(qr.path));
            ctx.restore();
        }
        ctx.fillStyle = QR_CAPTION;
        ctx.font = `400 22px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText(card.qr.alt, W / 2, by + qrBox + 22, qrBox - 30);
    }
    return canvas;
};

export const canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
    new Promise((resolve, reject) => {
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("Couldn’t encode the image"))), type, 0.92);
    });

/* ---------- SVG ---------- */

const escapeXml = (value: string): string =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** SVG text can't shrink to fit, so long values are cut with an ellipsis instead. */
const clipText = (value: string, maxWidth: number, size: number): string => {
    const max = Math.max(4, Math.floor(maxWidth / (size * 0.56)));
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

export const passSvg = async (card: WalletCardData, platform: WalletPlatform): Promise<string> => {
    const { google, width: W, height: H, qrBox } = layoutFor(card, platform);
    const qr = await qrPathFor(card);
    const { theme } = card;
    const fg = google ? theme.googleFg : theme.fg;
    const label = google ? theme.googleLabel : theme.label;
    const out: Array<string> = [];
    const text = (
        x: number,
        y: number,
        value: string,
        size: number,
        weight: number,
        fill: string,
        anchor = "",
        maxWidth = 0
    ) => {
        const content = escapeXml(maxWidth ? clipText(value, maxWidth, size) : value);
        const anchorAttr = anchor ? ` text-anchor="${anchor}"` : "";
        out.push(
            `<text x="${x}" y="${y}" font-family='${FONT}' font-size="${size}" font-weight="${weight}" fill="${fill}"${anchorAttr}>${content}</text>`
        );
    };

    out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
    out.push(
        `<defs><clipPath id="logo"><rect x="32" y="30" width="64" height="64" rx="${google ? 32 : 16}"/></clipPath></defs>`
    );
    const stroke = theme.border && theme.border !== "transparent" ? ` stroke="${theme.border}" stroke-width="2"` : "";
    out.push(`<rect width="${W}" height="${H}" rx="${google ? 48 : 32}" fill="${theme.bg}"${stroke}/>`);

    let textX = 32;
    if (card.logo.kind === "image" && card.logo.src) {
        out.push(
            `<g clip-path="url(#logo)"><rect x="32" y="30" width="64" height="64" fill="#FFFFFF"/><image href="${escapeXml(card.logo.src)}" x="36" y="34" width="56" height="56" preserveAspectRatio="xMidYMid meet"/></g>`
        );
        textX = 116;
    } else if (hasLogoTile(card)) {
        out.push(`<rect x="32" y="30" width="64" height="64" rx="${google ? 32 : 16}" fill="${theme.tileBg}"/>`);
        if (card.logo.kind === "mono")
            text(64, 72, card.logo.text, card.logo.text.length > 2 ? 21 : 26, 700, theme.tileFg, "middle");
        else if (card.logo.kind === "text") text(64, 70, card.logo.text, 22, 700, theme.tileFg, "middle");
        textX = 116;
    }
    text(textX, 74, card.title, google ? 30 : 32, google ? 500 : 600, fg, "", W - textX - 40);
    if (card.header && !google) {
        text(W - 32, 52, card.header.label.toUpperCase(), 20, 600, label, "end");
        text(W - 32, 88, card.header.value, 30, 500, fg, "end");
    }

    if (!google) {
        const primarySize = (card.primary.size ?? 24) * 2;
        let y = 168;
        if (card.primary.label) {
            text(32, y, card.primary.label.toUpperCase(), 21, 600, label);
            y += 12;
        }
        text(32, y + primarySize, card.primary.value, primarySize, 500, fg, "", W - 64);
        let rowY = 300;
        for (const row of appleFieldRows(card)) {
            for (const field of row) {
                const right = field.align === "right";
                const x = right ? W - 32 : 32;
                const maxWidth = row.length > 1 ? (W - 64) / 2 - 12 : W - 64;
                text(x, rowY, field.label.toUpperCase(), 21, 600, label, right ? "end" : "", maxWidth);
                text(x, rowY + 40, field.value, (field.size ?? 15) * 2, 500, fg, right ? "end" : "", maxWidth);
            }
            rowY += 112;
        }
    } else {
        const primarySize = (card.primary.googleSize ?? 24) * 2;
        const y = 160;
        text(36, y, card.googleSubheader ?? "", 26, 400, label, "", W - 72);
        text(36, y + primarySize + 10, card.primary.value, primarySize, 500, fg, "", W - 72);
        let rowY = y + primarySize + 92;
        for (const row of card.googleRows ?? []) {
            const cellWidth = (W - 72) / row.cells.length;
            row.cells.forEach((cell, index) => {
                const x = 36 + index * cellWidth;
                text(x, rowY, cell.label, 24, 400, label, "", cellWidth - 16);
                text(x, rowY + 40, cell.value, (cell.size ?? 15) * 2, 500, fg, "", cellWidth - 16);
            });
            rowY += 100;
        }
    }

    if (card.qr) {
        const bx = (W - qrBox) / 2;
        const by = H - qrBox - 92;
        out.push(`<rect x="${bx}" y="${by}" width="${qrBox}" height="${qrBox + 48}" rx="24" fill="${QR_PANEL_BG}"/>`);
        if (card.qr.imageSrc) {
            out.push(
                `<image href="${escapeXml(card.qr.imageSrc)}" x="${bx + 22}" y="${by + 22}" width="${qrBox - 44}" height="${qrBox - 44}"/>`
            );
        } else if (qr) {
            const scale = ((qrBox - 24) / qr.size).toFixed(4);
            out.push(
                `<path transform="translate(${bx + 12} ${by + 12}) scale(${scale})" d="${qr.path}" fill="${QR_DARK}" shape-rendering="crispEdges"/>`
            );
        }
        text(W / 2, by + qrBox + 26, card.qr.alt, 22, 400, QR_CAPTION, "middle", qrBox - 30);
    }
    out.push("</svg>");
    return out.join("\n");
};

/** A 1024px-ish PNG of just the QR code, for the "QR code" quick action. */
export const qrPngBlob = async (value: string): Promise<Blob | null> => {
    const result = generateQr(await loadQrEngine(), value);
    if (result.status !== "ok") return null;
    const scale = Math.max(8, Math.floor(1024 / result.size));
    const size = scale * result.size;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);
    ctx.scale(scale, scale);
    ctx.fillStyle = QR_DARK;
    ctx.fill(new Path2D(result.path));
    return canvasToBlob(canvas, "image/png");
};
