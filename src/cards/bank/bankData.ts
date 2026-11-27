import type { FlagRect } from "../../components/ui";

/*
 * Reference data for the bank card, from the design canvas. Bank colors are
 * brand data used on the card, not app tokens.
 */

const r = (left: number, top: number, width: number, height: number, color: string, round = false): FlagRect => ({
    left,
    top,
    width,
    height,
    color,
    radius: round ? "50%" : undefined
});

export type CountryId = "PK" | "DE" | "SA" | "AE" | "GB" | "US";

export interface Country {
    id: CountryId;
    name: string;
    currency: string;
    /** True when accounts use an IBAN; false (US) means a 9-digit routing number. */
    iban: boolean;
    /** IBAN length for this country. */
    ibanLength: number;
    /** Pakistan's Raast instant-payment ID. */
    raast: boolean;
    /** e.g. "Sort code" in the UK; defaults to "Branch code". */
    branchLabel?: string;
    /** Placeholder shown when the IBAN or routing number is empty. */
    example: string;
    flag: Array<FlagRect>;
}

export const COUNTRIES: Array<Country> = [
    {
        id: "PK",
        name: "Pakistan",
        currency: "PKR",
        iban: true,
        ibanLength: 24,
        raast: true,
        example: "PK00 BANK 0000 0000 0000 0000",
        flag: [
            r(0, 0, 100, 100, "#01411C"),
            r(0, 0, 25, 100, "#FFFFFF"),
            r(46, 26, 34, 47, "#FFFFFF", true),
            r(53, 20, 30, 41, "#01411C", true)
        ]
    },
    {
        id: "DE",
        name: "Germany",
        currency: "EUR",
        iban: true,
        ibanLength: 22,
        raast: false,
        example: "DE00 0000 0000 0000 0000 00",
        flag: [r(0, 0, 100, 34, "#000000"), r(0, 33, 100, 34, "#DD0000"), r(0, 66, 100, 34, "#FFCE00")]
    },
    {
        id: "SA",
        name: "Saudi Arabia",
        currency: "SAR",
        iban: true,
        ibanLength: 24,
        raast: false,
        example: "SA00 0000 0000 0000 0000 0000",
        flag: [r(0, 0, 100, 100, "#006C35"), r(25, 64, 50, 8, "#FFFFFF")]
    },
    {
        id: "AE",
        name: "United Arab Emirates",
        currency: "AED",
        iban: true,
        ibanLength: 23,
        raast: false,
        example: "AE00 0000 0000 0000 0000 000",
        flag: [
            r(0, 0, 100, 34, "#00732F"),
            r(0, 33, 100, 34, "#FFFFFF"),
            r(0, 66, 100, 34, "#000000"),
            r(0, 0, 26, 100, "#FF0000")
        ]
    },
    {
        id: "GB",
        name: "United Kingdom",
        currency: "GBP",
        iban: true,
        ibanLength: 22,
        raast: false,
        branchLabel: "Sort code",
        example: "GB00 BANK 0000 0000 0000 00",
        flag: [
            r(0, 0, 100, 100, "#012169"),
            r(0, 37, 100, 26, "#FFFFFF"),
            r(41, 0, 18, 100, "#FFFFFF"),
            r(0, 42, 100, 16, "#C8102E"),
            r(45, 0, 10, 100, "#C8102E")
        ]
    },
    {
        id: "US",
        name: "United States",
        currency: "USD",
        iban: false,
        ibanLength: 9,
        raast: false,
        example: "000000000",
        flag: [
            r(0, 0, 100, 100, "#FFFFFF"),
            r(0, 0, 100, 15.4, "#B22234"),
            r(0, 30.8, 100, 15.4, "#B22234"),
            r(0, 61.6, 100, 15.4, "#B22234"),
            r(0, 92.3, 100, 7.7, "#B22234"),
            r(0, 0, 44, 54, "#3C3B6E")
        ]
    }
];

export interface Bank {
    id: string;
    country: CountryId;
    name: string;
    /** Full name, shown under the short name in the list. */
    sub?: string;
    /** Monogram on the logo tile. */
    mono: string;
    /** Bank code inside the IBAN (after the check digits), used to match the IBAN to the bank. */
    code: string;
    swift: string;
    color: string;
    custom?: boolean;
}

export const BANKS: Array<Bank> = [
    {
        id: "alfalah",
        country: "PK",
        name: "Bank Alfalah",
        mono: "BAF",
        code: "ALFH",
        swift: "ALFHPKKA",
        color: "#C8102E"
    },
    {
        id: "hbl",
        country: "PK",
        name: "HBL",
        sub: "Habib Bank Limited",
        mono: "HBL",
        code: "HABB",
        swift: "HABBPKKA",
        color: "#00796B"
    },
    {
        id: "ubl",
        country: "PK",
        name: "UBL",
        sub: "United Bank Limited",
        mono: "UBL",
        code: "UNIL",
        swift: "UNILPKKA",
        color: "#0055A5"
    },
    { id: "meezan", country: "PK", name: "Meezan Bank", mono: "M", code: "MEZN", swift: "MEZNPKKA", color: "#6B2C83" },
    { id: "faysal", country: "PK", name: "Faysal Bank", mono: "FB", code: "FAYS", swift: "FAYSPKKA", color: "#0F5F45" },
    { id: "mcb", country: "PK", name: "MCB Bank", mono: "MCB", code: "MUCB", swift: "MUCBPKKA", color: "#007A3D" },
    {
        id: "scb",
        country: "PK",
        name: "Standard Chartered",
        sub: "Pakistan",
        mono: "SC",
        code: "SCBL",
        swift: "SCBLPKKX",
        color: "#0473EA"
    },
    { id: "abl", country: "PK", name: "Allied Bank", mono: "ABL", code: "ABPA", swift: "ABPAPKKA", color: "#003B71" },
    {
        id: "bahl",
        country: "PK",
        name: "Bank AL Habib",
        mono: "BAH",
        code: "BAHL",
        swift: "BAHLPKKA",
        color: "#8C1D24"
    },
    { id: "enbd", country: "AE", name: "Emirates NBD", mono: "ENB", code: "026", swift: "EBILAEAD", color: "#0A3D91" },
    {
        id: "fab",
        country: "AE",
        name: "First Abu Dhabi Bank",
        mono: "FAB",
        code: "035",
        swift: "NBADAEAA",
        color: "#23336B"
    },
    {
        id: "adcb",
        country: "AE",
        name: "ADCB",
        sub: "Abu Dhabi Commercial Bank",
        mono: "AD",
        code: "030",
        swift: "ADCBAEAA",
        color: "#B5121B"
    },
    { id: "rajhi", country: "SA", name: "Al Rajhi Bank", mono: "AR", code: "80", swift: "RJHISARI", color: "#1F3C88" },
    {
        id: "snb",
        country: "SA",
        name: "Saudi National Bank",
        mono: "SNB",
        code: "10",
        swift: "NCBKSAJE",
        color: "#00594F"
    },
    { id: "barclays", country: "GB", name: "Barclays", mono: "B", code: "BARC", swift: "BARCGB22", color: "#00AEEF" },
    { id: "hsbcuk", country: "GB", name: "HSBC UK", mono: "HS", code: "HBUK", swift: "HBUKGB4B", color: "#DB0011" },
    { id: "lloyds", country: "GB", name: "Lloyds Bank", mono: "L", code: "LOYD", swift: "LOYDGB2L", color: "#006A4D" },
    { id: "deutsche", country: "DE", name: "Deutsche Bank", mono: "DB", code: "", swift: "DEUTDEFF", color: "#0018A8" },
    { id: "commerz", country: "DE", name: "Commerzbank", mono: "CB", code: "", swift: "COBADEFF", color: "#FFCC00" },
    { id: "chase", country: "US", name: "Chase", mono: "C", code: "", swift: "CHASUS33", color: "#117ACA" },
    { id: "bofa", country: "US", name: "Bank of America", mono: "BA", code: "", swift: "BOFAUS3N", color: "#C41230" }
];

export const CUSTOM_BANK_ID = "custom";
export const CUSTOM_BANK_COLOR = "#334155";

export interface AccountType {
    id: string;
    label: string;
}

export const ACCOUNT_TYPES: Array<AccountType> = [
    { id: "current", label: "Current" },
    { id: "savings", label: "Savings" },
    { id: "business", label: "Business" },
    { id: "freelancer", label: "Freelancer" },
    { id: "digital", label: "Digital" },
    { id: "salary", label: "Salary" },
    { id: "fcy", label: "Foreign Currency" },
    { id: "custom", label: "Custom…" }
];

export interface Currency {
    id: string;
    label: string;
    sub: string;
}

export const CURRENCIES: Array<Currency> = [
    { id: "PKR", label: "PKR", sub: "Pakistani rupee" },
    { id: "USD", label: "USD", sub: "US dollar" },
    { id: "EUR", label: "EUR", sub: "Euro" },
    { id: "GBP", label: "GBP", sub: "British pound" },
    { id: "AED", label: "AED", sub: "UAE dirham" },
    { id: "SAR", label: "SAR", sub: "Saudi riyal" }
];

export type BankThemeId = "bank" | "light" | "dark" | "premium" | "custom";

export const BANK_THEMES: Array<{ id: BankThemeId; label: string }> = [
    { id: "bank", label: "Bank brand" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
    { id: "premium", label: "Black" },
    { id: "custom", label: "Custom" }
];

export const DEFAULT_CUSTOM_COLORS = { bg: "#1E293B", fg: "#F8FAFC", fg2: "#94A3B8" };

export type BankQrContent = "iban" | "accno" | "full" | "raast";
export type BankQrSource = "generate" | "upload";

export const countryById = (id: string): Country => COUNTRIES.find(country => country.id === id) ?? COUNTRIES[0];
export const bankById = (id: string): Bank | undefined => BANKS.find(bank => bank.id === id);
