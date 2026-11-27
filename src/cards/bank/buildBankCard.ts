import { Landmark } from "lucide-react";
import type { WalletCardData, WalletDetail, WalletField, WalletGoogleRow, WalletLogo } from "../../components/ui";
import { blend, luminance, readableOn } from "../../lib/color";
import { countryById } from "./bankData";
import type { Bank } from "./bankData";
import { accountTypeLabel, formatRaast, groupBy4, monoSize, resolveBank } from "./bankState";
import type { BankForm, BankLook, BankState } from "./bankState";

export const BANK_DISCLAIMER =
    "This pass shares bank account details only. It is not a debit or credit card and cannot be used for payments.";

export interface ThemeColors {
    bg: string;
    fg: string;
    fg2: string;
    border: string;
}

/** Background, text and border for a theme; "bank" follows the bank's brand color. */
export const themeColors = (
    look: Pick<BankLook, "theme" | "customBg" | "customFg" | "customFg2">,
    bank?: Bank
): ThemeColors => {
    switch (look.theme) {
        case "light":
            return { bg: "#FFFFFF", fg: "#111114", fg2: "#6B6B76", border: "#E4E4E7" };
        case "dark":
            return { bg: "#1C1C1F", fg: "#F5F5F7", fg2: "#A1A1AA", border: "#2C2C31" };
        case "premium":
            return { bg: "#0B0B0C", fg: "#F3EEE3", fg2: "#B89B66", border: "#232325" };
        case "custom":
            return {
                bg: look.customBg,
                fg: look.customFg,
                fg2: look.customFg2,
                border: luminance(look.customBg) > 0.85 ? "#E4E4E7" : "transparent"
            };
        default: {
            const bg = bank ? bank.color : "#27272A";
            const fg = readableOn(bg);
            return { bg, fg, fg2: blend(fg, bg, 0.74), border: "transparent" };
        }
    }
};

/** What the QR encodes and the caption under it. */
export const bankQrContent = ({ form, qr }: BankState): { text: string; alt: string } => {
    const country = countryById(form.country);
    const bank = resolveBank(form);
    const content = qr.content === "raast" && !(country.raast && form.raast) ? "iban" : qr.content;
    const title = form.title.trim();

    if (content === "accno") return { text: form.accNo, alt: "Scan to copy account number" };
    if (content === "raast") return { text: form.raast, alt: `Raast ID · ${formatRaast(form.raast)}` };
    if (content === "full") {
        return {
            text: [title, form.accNo, form.iban, bank?.name ?? ""].filter(Boolean).join("\n"),
            alt: "Scan for account details"
        };
    }
    return { text: form.iban, alt: country.iban ? "Scan to copy IBAN" : "Scan to copy routing number" };
};

const logoFor = (look: BankLook, bank: Bank | undefined): WalletLogo => {
    if (look.logo) return { kind: "image", src: look.logo };
    if (bank) return { kind: "mono", text: bank.mono, size: monoSize(bank.mono, true) };
    return { kind: "icon", icon: Landmark };
};

const detailsFor = (form: BankForm): Array<WalletDetail> => {
    const country = countryById(form.country);
    const details: Array<WalletDetail> = [];
    if (form.branchName.trim()) details.push({ id: "branchName", label: "Branch name", value: form.branchName.trim() });
    if (form.swift) details.push({ id: "swift", label: "SWIFT / BIC", value: form.swift });
    if (country.raast && form.raast) details.push({ id: "raast", label: "Raast ID", value: formatRaast(form.raast) });
    if (form.nickname.trim()) details.push({ id: "nickname", label: "Nickname", value: form.nickname.trim() });
    if (form.notes.trim()) details.push({ id: "notes", label: "Notes", value: form.notes.trim() });
    return details;
};

/**
 * The wallet pass for a bank account, mapped as on the design canvas.
 * Apple: bank name + mark, header Currency, primary = account title (labelled
 * with the account type), secondary = account no. + branch, auxiliary = IBAN.
 * Google: rows for account number + currency, IBAN, branch.
 * Empty required fields show dimmed placeholders; empty optional ones are hidden.
 */
export const buildBankCard = (state: BankState): WalletCardData => {
    const { form, look, qr } = state;
    const country = countryById(form.country);
    const bank = resolveBank(form);
    const colors = themeColors(look, bank);

    let tileBg: string;
    let tileFg: string;
    if (!bank) {
        tileBg = blend(colors.fg, colors.bg, 0.16);
        tileFg = colors.fg;
    } else if (look.theme === "bank") {
        tileBg = blend(colors.fg, colors.bg, 0.18);
        tileFg = colors.fg;
    } else {
        tileBg = bank.color;
        tileFg = readableOn(bank.color);
    }

    const typeName = accountTypeLabel(form);
    const typeLine = typeName ? `${typeName} account` : "";
    const title = form.title.trim();
    const titleLength = title.length || 20;
    const accView = groupBy4(form.accNo);
    const ibanView = groupBy4(form.iban);
    const ibanLength = (ibanView || country.example).length;
    const ibanLabel = country.iban ? "IBAN" : "Routing no.";
    const branchLabel = country.branchLabel ?? "Branch";
    const googleFg = readableOn(colors.bg);

    const secondary: Array<WalletField> = [];
    if (look.showAccNo) {
        secondary.push({
            id: "accNo",
            label: "Account no.",
            value: accView || "0000 0000 0000",
            dimmed: !accView,
            flex: 1.6
        });
    }
    if (look.showBranch && form.branchCode) {
        secondary.push({
            id: "branch",
            label: branchLabel,
            value: form.branchCode,
            align: secondary.length ? "right" : "left"
        });
    }

    const auxiliary: Array<WalletField> = [];
    if (look.showIban) {
        auxiliary.push({
            id: "iban",
            label: ibanLabel,
            value: ibanView || country.example,
            dimmed: !ibanView,
            size: ibanLength > 32 ? 13 : ibanLength > 29 ? 14 : 15
        });
    }

    const googleRows: Array<WalletGoogleRow> = [];
    const firstRow: Array<WalletField> = [];
    if (look.showAccNo) {
        firstRow.push({ id: "accNo", label: "Account number", value: accView || "0000 0000 0000", dimmed: !accView });
    }
    if (look.showCurrency) firstRow.push({ id: "currency", label: "Currency", value: form.currency || "—" });
    if (firstRow.length) googleRows.push({ id: "account", cells: firstRow });
    if (look.showIban) {
        googleRows.push({
            id: "iban",
            cells: [
                {
                    id: "iban",
                    label: country.iban ? "IBAN" : "Routing number",
                    value: ibanView || country.example,
                    dimmed: !ibanView,
                    size: ibanLength > 30 ? 14 : 15
                }
            ]
        });
    }
    if (look.showBranch && form.branchCode) {
        googleRows.push({
            id: "branch",
            cells: [{ id: "branch", label: country.branchLabel ?? "Branch code", value: form.branchCode }]
        });
    }

    const qrContent = bankQrContent(state);
    const uploaded = qr.source === "upload";

    return {
        theme: {
            bg: colors.bg,
            fg: colors.fg,
            label: colors.fg2,
            border: colors.border,
            googleFg,
            googleLabel: blend(googleFg, colors.bg, 0.72),
            tileBg,
            tileFg
        },
        title: bank ? bank.name : "Your bank",
        titleDimmed: !bank,
        logo: logoFor(look, bank),
        header: look.showCurrency ? { label: "Currency", value: form.currency || "—" } : undefined,
        primary: {
            label: look.showType && typeLine ? typeLine : "Account title",
            value: title || "Account holder name",
            dimmed: !title,
            size: titleLength <= 16 ? 24 : titleLength <= 22 ? 21 : titleLength <= 30 ? 18 : 16,
            googleSize: titleLength <= 16 ? 24 : titleLength <= 24 ? 21 : 18
        },
        secondary,
        auxiliary,
        googleSubheader: look.showType ? typeLine || "Account type" : "Bank account",
        googleSubheaderDimmed: look.showType && !typeLine,
        googleRows,
        qr: qr.on
            ? uploaded
                ? {
                      value: "",
                      alt: qr.caption.trim() || "Scan to pay",
                      imageSrc: qr.img || undefined,
                      pending: !qr.img,
                      pendingText: "Upload your QR"
                  }
                : {
                      // An example value keeps the empty card looking like a real pass.
                      value: qrContent.text || country.example.replace(/\s/g, ""),
                      alt: qrContent.alt
                  }
            : undefined,
        details: detailsFor(form),
        emptyDetailsText:
            "No additional details yet. Add a branch name, SWIFT code, Raast ID or notes under Additional details.",
        disclaimer: BANK_DISCLAIMER,
        minHeight: qr.on ? 470 : 330
    };
};

/** Plain-text account details for "Copy details" and "Share". */
export const bankDetailsText = ({ form }: BankState): string => {
    const country = countryById(form.country);
    const bank = resolveBank(form);
    const type = accountTypeLabel(form);
    const lines = [
        bank ? `Bank: ${bank.name}` : "",
        form.title.trim() ? `Account title: ${form.title.trim()}` : "",
        type ? `Account type: ${type}` : "",
        form.accNo ? `Account number: ${form.accNo}` : "",
        form.iban ? `${country.iban ? "IBAN" : "Routing number"}: ${groupBy4(form.iban)}` : "",
        form.currency ? `Currency: ${form.currency}` : "",
        form.branchCode ? `${country.branchLabel ?? "Branch code"}: ${form.branchCode}` : "",
        form.branchName.trim() ? `Branch: ${form.branchName.trim()}` : "",
        form.swift ? `SWIFT/BIC: ${form.swift}` : "",
        country.raast && form.raast ? `Raast ID: ${form.raast}` : ""
    ];
    return lines.filter(Boolean).join("\n");
};
