import qrcode from "qrcode-generator";

/** Modules of white space around the code, as the QR spec requires. */
export const QR_QUIET_ZONE = 4;

export type QrResult =
    | { status: "empty" }
    | { status: "overflow" }
    | {
          status: "ok";
          /** SVG path of the dark modules, already offset by the quiet zone. */
          path: string;
          /** Width and height of the SVG viewBox, quiet zone included. */
          size: number;
          level: "M" | "L";
      };

/**
 * qrcode-generator's default byte encoder keeps only the low 8 bits of each
 * UTF-16 code unit. Encoding to UTF-8 first and passing one char per byte
 * makes it emit the correct bytes for any text.
 */
const toByteString = (text: string): string => {
    const bytes = new TextEncoder().encode(text);
    let out = "";
    for (const byte of bytes) out += String.fromCharCode(byte);
    return out;
};

/** Merges each row's dark modules into horizontal runs to keep the path short. */
const toPath = (isDark: (row: number, col: number) => boolean, count: number): string => {
    let d = "";
    for (let row = 0; row < count; row += 1) {
        let col = 0;
        while (col < count) {
            if (!isDark(row, col)) {
                col += 1;
                continue;
            }
            const start = col;
            while (col < count && isDark(row, col)) col += 1;
            d += `M${start + QR_QUIET_ZONE} ${row + QR_QUIET_ZONE}h${col - start}v1h-${col - start}z`;
        }
    }
    return d;
};

/**
 * Builds a QR code in UTF-8 byte mode. Tries error correction level M and
 * falls back to L when the text is too long, then reports overflow.
 */
export const generateQr = (text: string): QrResult => {
    if (!text) return { status: "empty" };
    const data = toByteString(text);
    const levels: Array<"M" | "L"> = ["M", "L"];
    for (const level of levels) {
        try {
            const qr = qrcode(0, level);
            qr.addData(data, "Byte");
            qr.make();
            const count = qr.getModuleCount();
            return {
                status: "ok",
                path: toPath((row, col) => qr.isDark(row, col), count),
                size: count + QR_QUIET_ZONE * 2,
                level
            };
        } catch {
            // The library throws a plain string ("code length overflow") — try the next level.
        }
    }
    return { status: "overflow" };
};
