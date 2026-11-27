import type { WalletCardData, WalletField } from "../components/ui";

/*
 * Unsigned pass definitions built from the preview card. Neither file can be
 * installed as is: Apple passes must be signed with a Pass Type ID
 * certificate, and Google passes need an issuer account. This app holds no
 * keys, so it hands the user the definition to sign with their own setup.
 */

const APPLE_MAX_FIELDS = 4;

/** "#C8102E", "#fff", "rgb(…)" or "rgba(…)" → "rgb(200, 16, 46)"; anything else → undefined. */
export const toRgbString = (color: string): string | undefined => {
    const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
        const digits = hex[1].length === 3 ? [...hex[1]].map(d => d + d).join("") : hex[1];
        const [r, g, b] = [0, 2, 4].map(i => Number.parseInt(digits.slice(i, i + 2), 16));
        return `rgb(${r}, ${g}, ${b})`;
    }
    const rgb = color.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    return rgb ? `rgb(${rgb[1]}, ${rgb[2]}, ${rgb[3]})` : undefined;
};

/** Google wants "#RRGGBB". */
const toHex = (color: string): string | undefined => {
    const rgb = toRgbString(color)?.match(/\d+/g);
    return rgb ? `#${rgb.map(n => Number(n).toString(16).padStart(2, "0")).join("")}`.toUpperCase() : undefined;
};

const toAppleFields = (fields: Array<WalletField>, prefix: string) =>
    fields.map((field, index) => ({
        key: `${prefix}${index}`,
        label: field.label,
        value: field.value,
        ...(field.align === "right" ? { textAlignment: "PKTextAlignmentRight" } : {})
    }));

const hasScannableQr = (card: WalletCardData): boolean =>
    Boolean(card.qr && !card.qr.pending && !card.qr.imageSrc && card.qr.value);

export const buildApplePassJson = (card: WalletCardData, description: string): Record<string, unknown> => {
    const secondary = (card.secondary ?? []).slice(0, APPLE_MAX_FIELDS);
    const auxiliary = (card.auxiliary ?? []).slice(0, APPLE_MAX_FIELDS - secondary.length);
    return {
        formatVersion: 1,
        passTypeIdentifier: "pass.com.yourcompany.passcard",
        teamIdentifier: "YOUR_TEAM_ID",
        serialNumber: `PC-${Date.now()}`,
        organizationName: card.title,
        description,
        logoText: card.title,
        foregroundColor: toRgbString(card.theme.fg),
        backgroundColor: toRgbString(card.theme.bg),
        labelColor: toRgbString(card.theme.label),
        generic: {
            headerFields: card.header ? [{ key: "h0", label: card.header.label, value: card.header.value }] : [],
            primaryFields: [{ key: "p0", label: card.primary.label ?? "", value: card.primary.value }],
            secondaryFields: toAppleFields(secondary, "s"),
            auxiliaryFields: toAppleFields(auxiliary, "a"),
            backFields: (card.details ?? []).map((detail, index) => ({
                key: `b${index}`,
                label: detail.label,
                value: detail.value
            }))
        },
        barcodes: hasScannableQr(card)
            ? [
                  {
                      format: "PKBarcodeFormatQR",
                      message: card.qr?.value,
                      messageEncoding: "utf-8",
                      altText: card.qr?.alt
                  }
              ]
            : [],
        _note: `Unsigned pass definition generated in the browser. Add icon.png and logo.png${card.thumbnail ? ", thumbnail.png" : ""}, then sign it with your Pass Type ID certificate to create a .pkpass.`
    };
};

const localized = (value: string) => ({ defaultValue: { language: "en", value } });

export const buildGooglePassObject = (card: WalletCardData): Record<string, unknown> => {
    const rowFields = (card.googleRows ?? []).flatMap(row => row.cells);
    const modules = [...rowFields, ...(card.details ?? [])];
    return {
        genericObject: {
            id: `ISSUER_ID.passcard-${Date.now()}`,
            classId: "ISSUER_ID.passcard",
            state: "ACTIVE",
            cardTitle: localized(card.title),
            header: localized(card.primary.value),
            subheader: card.googleSubheader ? localized(card.googleSubheader) : undefined,
            hexBackgroundColor: toHex(card.theme.bg),
            textModulesData: modules.map((item, index) => ({ id: `t${index}`, header: item.label, body: item.value })),
            barcode: hasScannableQr(card)
                ? { type: "QR_CODE", value: card.qr?.value, alternateText: card.qr?.alt }
                : undefined
        },
        _note: "Unsigned Google Wallet generic object generated in the browser. Replace ISSUER_ID and create the save link with your own issuer account."
    };
};
