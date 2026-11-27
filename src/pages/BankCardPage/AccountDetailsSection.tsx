import { Activity, memo, useCallback, useMemo } from "react";
import { UserRound } from "lucide-react";
import { countryById } from "../../cards/bank/bankData";
import { groupBy4, resolveBank } from "../../cards/bank/bankState";
import type { BankForm } from "../../cards/bank/bankState";
import type { BankErrorKey, BankErrors } from "../../cards/bank/bankValidation";
import { Disclosure, SectionCard } from "../../components/ui";
import { BankField } from "./BankField";

const cleanTitle = (value: string) => value.replace(/\s{2,}/g, " ").replace(/^\s+/, "");
const cleanDigits = (max: number) => (value: string) => value.replace(/\D/g, "").slice(0, max);
const cleanAccNo = cleanDigits(20);
const cleanRaast = cleanDigits(11);
const cleanIban = (value: string) =>
    value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 34);
const cleanBranch = (value: string) => value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 10);
const cleanSwift = (value: string) =>
    value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 11);

interface AccountDetailsSectionProps {
    form: BankForm;
    setForm: (patch: Partial<BankForm>) => void;
    errors: BankErrors;
    onTouch: (key: BankErrorKey) => void;
}

export const AccountDetailsSection = memo<AccountDetailsSectionProps>(({ form, setForm, errors, onTouch }) => {
    const country = useMemo(() => countryById(form.country), [form.country]);
    const bank = useMemo(() => resolveBank(form), [form]);

    const ibanPlaceholder = useMemo(() => {
        if (!country.iban) return "e.g. 021000021";
        // Show the bank's code in place, e.g. "PK00 ALFH 0000 0000 0000 0000".
        if (bank?.code && country.id !== "AE" && country.id !== "SA") {
            const rest = country.ibanLength - 8;
            return `${country.id}00 ${bank.code} ${"0000 0000 0000 0000".slice(0, rest + Math.floor(rest / 4))}`;
        }
        return country.example;
    }, [country, bank]);

    const ibanHint = useMemo(
        () =>
            country.iban
                ? `${country.ibanLength} characters starting with ${country.id}. Find it under account details in your banking app.`
                : "9 digits, printed at the bottom of your checks.",
        [country]
    );
    const swiftHint = useMemo(
        () => (bank?.swift && form.swiftAuto ? `Filled in from ${bank.name}.` : "8 or 11 characters."),
        [bank, form.swiftAuto]
    );
    // Typing a SWIFT code means it no longer follows the chosen bank.
    const swiftSetter = useCallback((patch: Partial<BankForm>) => setForm({ ...patch, swiftAuto: false }), [setForm]);

    const addedCount = useMemo(
        () =>
            [
                form.branchCode,
                form.branchName.trim(),
                form.swift,
                country.raast ? form.raast : "",
                form.nickname.trim(),
                form.notes.trim()
            ].filter(Boolean).length,
        [form, country.raast]
    );
    const extraError = Boolean(errors.swift || errors.raast);

    return (
        <SectionCard
            icon={UserRound}
            title="Account details"
            description="Exactly as shown in your banking app or on your statement."
        >
            <div className="bank-grid2">
                <BankField
                    name="title"
                    label="Account title"
                    form={form}
                    setForm={setForm}
                    clean={cleanTitle}
                    errors={errors}
                    onTouch={onTouch}
                    placeholder="e.g. Ayesha Raza Khan"
                    hint="The name the account is held in."
                    maxLength={70}
                />
                <BankField
                    name="accNo"
                    label="Account number"
                    display={groupBy4(form.accNo)}
                    form={form}
                    setForm={setForm}
                    clean={cleanAccNo}
                    errors={errors}
                    onTouch={onTouch}
                    placeholder="e.g. 5501 0012 3456 78"
                    hint="Digits only — spaces are added for you."
                    inputMode="numeric"
                    mono
                    maxLength={26}
                />
            </div>
            <BankField
                name="iban"
                label={country.iban ? "IBAN" : "Routing number (ABA)"}
                display={groupBy4(form.iban)}
                form={form}
                setForm={setForm}
                clean={cleanIban}
                errors={errors}
                onTouch={onTouch}
                placeholder={ibanPlaceholder}
                hint={ibanHint}
                inputMode={country.iban ? "text" : "numeric"}
                mono
                maxLength={42}
            />
            <Disclosure
                title="Additional details"
                summary={
                    country.raast
                        ? "Branch, SWIFT / BIC, Raast ID, nickname and notes"
                        : "Branch, SWIFT / BIC, nickname and notes"
                }
                count={extraError ? 0 : addedCount}
                hasError={extraError}
            >
                <div className="bank-grid2">
                    <BankField
                        name="branchCode"
                        label={country.branchLabel ?? "Branch code"}
                        form={form}
                        setForm={setForm}
                        clean={cleanBranch}
                        placeholder={country.branchLabel ? "00-00-00" : "e.g. 5501"}
                        optional
                        mono
                        maxLength={10}
                    />
                    <BankField
                        name="branchName"
                        label="Branch name"
                        form={form}
                        setForm={setForm}
                        placeholder="e.g. F-7 Markaz, Islamabad"
                        optional
                        maxLength={60}
                    />
                    <BankField
                        name="swift"
                        label="SWIFT / BIC"
                        form={form}
                        setForm={swiftSetter}
                        clean={cleanSwift}
                        errors={errors}
                        onTouch={onTouch}
                        placeholder="e.g. ALFHPKKA"
                        hint={swiftHint}
                        optional
                        mono
                        maxLength={11}
                    />
                    <Activity mode={country.raast ? "visible" : "hidden"}>
                        <BankField
                            name="raast"
                            label="Raast ID"
                            form={form}
                            setForm={setForm}
                            clean={cleanRaast}
                            errors={errors}
                            onTouch={onTouch}
                            placeholder="03XX XXXXXXX"
                            hint="Your mobile number linked to Raast."
                            inputMode="numeric"
                            optional
                            mono
                            maxLength={11}
                        />
                    </Activity>
                    <BankField
                        name="nickname"
                        label="Account nickname"
                        form={form}
                        setForm={setForm}
                        placeholder="e.g. Freelance income"
                        hint="Only you see this, on the pass details."
                        optional
                        maxLength={32}
                    />
                </div>
                <BankField
                    name="notes"
                    label="Additional notes"
                    form={form}
                    setForm={setForm}
                    placeholder="e.g. Please share the transfer receipt on WhatsApp."
                    optional
                    multiline
                    maxLength={200}
                />
            </Disclosure>
        </SectionCard>
    );
});

AccountDetailsSection.displayName = "AccountDetailsSection";

export default AccountDetailsSection;
