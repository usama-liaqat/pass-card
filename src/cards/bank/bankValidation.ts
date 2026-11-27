import { countryById } from "./bankData";
import { resolveBank } from "./bankState";
import type { BankState } from "./bankState";

export type BankErrorKey =
    | "bank"
    | "customBank"
    | "type"
    | "customType"
    | "title"
    | "accNo"
    | "iban"
    | "swift"
    | "raast"
    | "qrImg";

export type BankErrors = Partial<Record<BankErrorKey, string>>;

/** The five required details counted by the progress bar. */
export const REQUIRED_KEYS = ["bank", "type", "title", "accNo", "iban"] as const;

/**
 * ISO 13616 check: move the first four characters to the end, turn letters
 * into numbers (A = 10 … Z = 35) and the result mod 97 must be 1. Catches any
 * single wrong character and most swapped pairs.
 */
export const ibanChecksumValid = (iban: string): boolean => {
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    let remainder = 0;
    for (const char of rearranged) {
        const code = char.charCodeAt(0);
        const digits = code >= 65 && code <= 90 ? String(code - 55) : char;
        for (const digit of digits) remainder = (remainder * 10 + (digit.charCodeAt(0) - 48)) % 97;
    }
    return remainder === 1;
};

export const validateBank = ({ form, qr }: BankState): BankErrors => {
    const errors: BankErrors = {};
    const country = countryById(form.country);
    const bank = resolveBank(form);

    if (!form.bankId) errors.bank = "Choose your bank to continue";
    else if (bank?.custom && !form.customBank.trim()) errors.customBank = "Enter your bank’s name";

    if (!form.type) errors.type = "Choose an account type";
    else if (form.type === "custom" && !form.customType.trim()) {
        errors.customType = "Name your account type, e.g. Joint account";
    }

    const title = form.title.trim();
    if (!title) errors.title = "Enter the account title exactly as on your statement";
    else if (title.length < 3) errors.title = "That looks too short for an account title";

    if (!form.accNo) errors.accNo = "Enter your account number";
    else if (form.accNo.length < 6 || form.accNo.length > 20) errors.accNo = "Account numbers are usually 6–20 digits";

    const iban = form.iban;
    if (country.iban) {
        const bankCode = bank?.code ?? "";
        if (!iban) errors.iban = "Enter your IBAN";
        else if (iban.slice(0, 2) !== country.id) errors.iban = `${country.name} IBANs start with ${country.id}`;
        else if (iban.length !== country.ibanLength) {
            errors.iban = `${country.id} IBANs have ${country.ibanLength} characters — you’ve entered ${iban.length}`;
        } else if (!ibanChecksumValid(iban)) errors.iban = "The check digits don’t match. Look for a typo";
        else if (bankCode && iban.slice(4, 4 + bankCode.length) !== bankCode) {
            errors.iban = `This IBAN belongs to a different bank (${iban.slice(4, 4 + bankCode.length)})`;
        }
    } else if (!iban) errors.iban = "Enter your routing number";
    else if (!/^\d{9}$/.test(iban)) errors.iban = "Routing numbers have 9 digits";

    if (form.swift && !/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(form.swift)) {
        errors.swift = "SWIFT/BIC codes have 8 or 11 characters";
    }
    if (country.raast && form.raast && !/^03\d{9}$/.test(form.raast)) {
        errors.raast = "Use your 11-digit mobile number, e.g. 03001234567";
    }
    if (qr.on && qr.source === "upload" && !qr.img) {
        errors.qrImg = "Upload your QR image, or switch to Generate from details";
    }
    return errors;
};

/** How many of the five required details are complete. */
export const countRequiredDone = (errors: BankErrors): number =>
    REQUIRED_KEYS.filter(key => {
        if (key === "bank") return !errors.bank && !errors.customBank;
        if (key === "type") return !errors.type && !errors.customType;
        return !errors[key];
    }).length;
