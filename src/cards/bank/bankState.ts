import type { CardDraft, DraftValue } from "../draftStore";
import { ACCOUNT_TYPES, CUSTOM_BANK_COLOR, CUSTOM_BANK_ID, DEFAULT_CUSTOM_COLORS, bankById } from "./bankData";
import type { Bank, BankQrContent, BankQrSource, BankThemeId } from "./bankData";

/** What the user typed. Stored in draft.form (strings only). */
export interface BankForm {
    country: string;
    bankId: string;
    customBank: string;
    type: string;
    customType: string;
    currency: string;
    title: string;
    /** Digits only; shown grouped by 4. */
    accNo: string;
    /** Uppercase letters and digits only; shown grouped by 4. */
    iban: string;
    branchCode: string;
    branchName: string;
    swift: string;
    /** True while the SWIFT code was filled in from the bank (not typed). */
    swiftAuto: boolean;
    raast: string;
    nickname: string;
    notes: string;
}

/** How the card looks. Stored in draft.appearance. */
export interface BankLook {
    theme: BankThemeId;
    customBg: string;
    customFg: string;
    customFg2: string;
    /** Data URL of an uploaded logo (kept in this tab only). */
    logo: string;
    logoName: string;
    showType: boolean;
    showAccNo: boolean;
    showIban: boolean;
    showBranch: boolean;
    showCurrency: boolean;
}

/** QR code settings. Stored in draft.qr. */
export interface BankQr {
    on: boolean;
    content: BankQrContent;
    source: BankQrSource;
    /** Data URL of an uploaded QR image. */
    img: string;
    imgName: string;
    caption: string;
}

export interface BankState {
    form: BankForm;
    look: BankLook;
    qr: BankQr;
}

export const BANK_FORM_DEFAULTS: BankForm = {
    country: "PK",
    bankId: "",
    customBank: "",
    type: "",
    customType: "",
    currency: "PKR",
    title: "",
    accNo: "",
    iban: "",
    branchCode: "",
    branchName: "",
    swift: "",
    swiftAuto: false,
    raast: "",
    nickname: "",
    notes: ""
};

export const BANK_LOOK_DEFAULTS: BankLook = {
    theme: "bank",
    customBg: DEFAULT_CUSTOM_COLORS.bg,
    customFg: DEFAULT_CUSTOM_COLORS.fg,
    customFg2: DEFAULT_CUSTOM_COLORS.fg2,
    logo: "",
    logoName: "",
    showType: true,
    showAccNo: true,
    showIban: true,
    showBranch: true,
    showCurrency: true
};

export const BANK_QR_DEFAULTS: BankQr = {
    on: true,
    content: "iban",
    source: "generate",
    img: "",
    imgName: "",
    caption: ""
};

/** Sample account from the design, used for the homepage preview. */
export const BANK_SAMPLE: BankState = {
    form: {
        ...BANK_FORM_DEFAULTS,
        bankId: "alfalah",
        type: "savings",
        title: "Ayesha Raza Khan",
        accNo: "55010012345678",
        iban: "PK83ALFH0055010012345678",
        branchCode: "5501",
        branchName: "F-7 Markaz, Islamabad",
        swift: "ALFHPKKA",
        swiftAuto: true,
        raast: "03001234567"
    },
    look: BANK_LOOK_DEFAULTS,
    qr: BANK_QR_DEFAULTS
};

/** Merges stored values over the defaults, keeping only values of the right type. */
const merge = <T extends object>(defaults: T, stored: Record<string, DraftValue>): T => {
    const out = { ...defaults } as Record<string, unknown>;
    for (const [key, fallback] of Object.entries(defaults)) {
        const value = stored[key];
        if (value === undefined) continue;
        if (typeof fallback === "boolean") out[key] = value === true || value === "true";
        else if (typeof value === "string") out[key] = value;
    }
    return out as T;
};

export const readBankState = (draft: CardDraft): BankState => ({
    form: merge(BANK_FORM_DEFAULTS, draft.form),
    look: merge(BANK_LOOK_DEFAULTS, draft.appearance),
    qr: merge(BANK_QR_DEFAULTS, draft.qr)
});

/** draft.form holds strings, so booleans are stored as "true" / "". */
export const toFormPatch = (patch: Partial<BankForm>): Record<string, string> =>
    Object.fromEntries(
        Object.entries(patch).map(([key, value]) => [
            key,
            typeof value === "boolean" ? (value ? "true" : "") : String(value)
        ])
    );

/* Derived values */

export const groupBy4 = (value: string): string => value.replace(/(.{4})/g, "$1 ").trim();

export const formatRaast = (raast: string): string =>
    raast.length > 4 ? `${raast.slice(0, 4)} ${raast.slice(4)}` : raast;

/** Initials for a custom bank's monogram: "Bank of Punjab" → "BP". */
export const initialsOf = (name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "B";
    return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/** Monogram font size by length; `big` is the 32px card tile, otherwise the 24–28px list tile. */
export const monoSize = (text: string, big: boolean): number => {
    const n = text.length;
    if (big) return n >= 3 ? 10.5 : n === 2 ? 12.5 : 15;
    return n >= 3 ? 8.5 : n === 2 ? 10 : 12;
};

/** The chosen bank, or a stand-in for a bank added by hand. */
export const resolveBank = (form: BankForm): Bank | undefined => {
    if (form.bankId === CUSTOM_BANK_ID) {
        return {
            id: CUSTOM_BANK_ID,
            country: "PK",
            name: form.customBank.trim() || "Custom bank",
            mono: initialsOf(form.customBank),
            code: "",
            swift: "",
            color: CUSTOM_BANK_COLOR,
            custom: true
        };
    }
    return bankById(form.bankId);
};

/** "Savings", a custom name, or "" when no type is chosen. */
export const accountTypeLabel = (form: BankForm): string => {
    if (!form.type) return "";
    if (form.type === "custom") return form.customType.trim();
    return ACCOUNT_TYPES.find(type => type.id === form.type)?.label ?? "";
};
