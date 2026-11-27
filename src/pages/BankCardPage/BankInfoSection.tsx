import { Activity, memo, useCallback, useMemo } from "react";
import { Landmark } from "lucide-react";
import {
    ACCOUNT_TYPES,
    BANKS,
    COUNTRIES,
    CURRENCIES,
    CUSTOM_BANK_COLOR,
    CUSTOM_BANK_ID,
    bankById,
    countryById
} from "../../cards/bank/bankData";
import { initialsOf, monoSize, resolveBank } from "../../cards/bank/bankState";
import type { BankForm } from "../../cards/bank/bankState";
import type { BankErrorKey, BankErrors } from "../../cards/bank/bankValidation";
import { Banner, SectionCard, Select } from "../../components/ui";
import type { SelectOption } from "../../components/ui";
import { readableOn } from "../../lib/color";
import { BankField } from "./BankField";

const COUNTRY_OPTIONS: Array<SelectOption> = COUNTRIES.map(country => ({
    id: country.id,
    label: country.name,
    sub: country.currency,
    leading: { kind: "flag", rects: country.flag }
}));

const TYPE_OPTIONS: Array<SelectOption> = ACCOUNT_TYPES.map(type => ({ id: type.id, label: type.label }));

const CURRENCY_OPTIONS: Array<SelectOption> = CURRENCIES.map(currency => ({
    id: currency.id,
    label: currency.label,
    sub: currency.sub
}));

interface BankInfoSectionProps {
    form: BankForm;
    setForm: (patch: Partial<BankForm>) => void;
    errors: BankErrors;
    onTouch: (key: BankErrorKey) => void;
}

/** Country, bank, account type and currency. Picking a bank brings its colors, mark and SWIFT code. */
export const BankInfoSection = memo<BankInfoSectionProps>(({ form, setForm, errors, onTouch }) => {
    const bank = useMemo(() => resolveBank(form), [form]);

    const bankOptions = useMemo<Array<SelectOption>>(() => {
        const options: Array<SelectOption> = BANKS.filter(item => item.country === form.country).map(item => ({
            id: item.id,
            label: item.name,
            sub: `${item.sub ? `${item.sub} · ` : ""}${item.swift}`,
            keywords: item.code,
            leading: {
                kind: "mono",
                text: item.mono,
                bg: item.color,
                fg: readableOn(item.color),
                size: monoSize(item.mono, false)
            }
        }));
        if (form.bankId === CUSTOM_BANK_ID) {
            const mono = initialsOf(form.customBank);
            options.push({
                id: CUSTOM_BANK_ID,
                label: form.customBank.trim() || "Custom bank",
                sub: "Added manually",
                leading: { kind: "mono", text: mono, bg: CUSTOM_BANK_COLOR, fg: "#FFFFFF", size: monoSize(mono, false) }
            });
        }
        return options;
    }, [form.country, form.bankId, form.customBank]);

    const pickCountry = useCallback(
        (id: string) => {
            const country = countryById(id);
            const patch: Partial<BankForm> = { country: id, currency: country.currency };
            // A listed bank from another country no longer applies.
            if (bank && !bank.custom && bank.country !== id) {
                patch.bankId = "";
                if (form.swiftAuto) {
                    patch.swift = "";
                    patch.swiftAuto = false;
                }
            }
            setForm(patch);
        },
        [bank, form.swiftAuto, setForm]
    );

    const pickBank = useCallback(
        (id: string) => {
            const picked = bankById(id);
            const patch: Partial<BankForm> = { bankId: id };
            // Fill SWIFT from the bank unless the user typed their own.
            if (picked && (!form.swift || form.swiftAuto)) {
                patch.swift = picked.swift;
                patch.swiftAuto = true;
            }
            setForm(patch);
        },
        [form.swift, form.swiftAuto, setForm]
    );

    const addBank = useCallback(
        (query: string) =>
            setForm({
                bankId: CUSTOM_BANK_ID,
                customBank: query,
                swift: form.swiftAuto ? "" : form.swift,
                swiftAuto: false
            }),
        [form.swift, form.swiftAuto, setForm]
    );

    const pickType = useCallback((id: string) => setForm({ type: id }), [setForm]);
    const pickCurrency = useCallback((id: string) => setForm({ currency: id }), [setForm]);

    const isCustomBank = form.bankId === CUSTOM_BANK_ID;
    const appliedText = useMemo(
        () => (bank && !bank.custom ? `${bank.name} selected — brand colors, logo mark and SWIFT code applied.` : ""),
        [bank]
    );

    return (
        <SectionCard
            icon={Landmark}
            title="Bank information"
            description="Pick your bank and we’ll apply its logo, colors and SWIFT code."
        >
            <div className="bank-grid2">
                <Select
                    label="Country"
                    options={COUNTRY_OPTIONS}
                    value={form.country}
                    onValueChange={pickCountry}
                    searchPlaceholder="Search countries"
                />
                <Select
                    label="Bank"
                    options={bankOptions}
                    value={form.bankId || null}
                    onValueChange={pickBank}
                    placeholder="Choose your bank"
                    searchPlaceholder="Search banks or SWIFT"
                    footerLabel="Bank not listed? Add {query} manually"
                    onFooterAction={addBank}
                    error={errors.bank}
                />
            </div>
            <Activity mode={isCustomBank ? "visible" : "hidden"}>
                <BankField
                    name="customBank"
                    label="Bank name"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    onTouch={onTouch}
                    placeholder="e.g. Bank of Punjab"
                    hint="Upload its logo under Card appearance."
                    maxLength={48}
                />
            </Activity>
            <Activity mode={appliedText ? "visible" : "hidden"}>
                <Banner tone="success">{appliedText}</Banner>
            </Activity>
            <div className="bank-grid2">
                <Select
                    label="Account type"
                    options={TYPE_OPTIONS}
                    value={form.type || null}
                    onValueChange={pickType}
                    placeholder="Choose type"
                    searchable={false}
                    error={errors.type}
                />
                <Select
                    label="Account currency"
                    options={CURRENCY_OPTIONS}
                    value={form.currency || null}
                    onValueChange={pickCurrency}
                    placeholder="Choose currency"
                    searchPlaceholder="Search currencies"
                />
            </div>
            <Activity mode={form.type === "custom" ? "visible" : "hidden"}>
                <BankField
                    name="customType"
                    label="Account type name"
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    onTouch={onTouch}
                    placeholder="e.g. Joint account"
                    maxLength={28}
                />
            </Activity>
        </SectionCard>
    );
});

BankInfoSection.displayName = "BankInfoSection";

export default BankInfoSection;
