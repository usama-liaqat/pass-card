import { memo, useCallback } from "react";
import type { HTMLAttributes } from "react";
import type { BankErrorKey, BankErrors } from "../../cards/bank/bankValidation";
import type { BankForm } from "../../cards/bank/bankState";
import { Field } from "../../components/ui";

type TextKey = {
    [K in keyof BankForm]: BankForm[K] extends string ? K : never;
}[keyof BankForm];

export interface BankFieldProps {
    name: TextKey;
    label: string;
    /** Value to show, e.g. the account number grouped by 4. Defaults to the stored value. */
    display?: string;
    form: BankForm;
    setForm: (patch: Partial<BankForm>) => void;
    /** Normalizes input before it is stored, e.g. digits only. */
    clean?: (value: string) => string;
    errors?: BankErrors;
    onTouch?: (key: BankErrorKey) => void;
    placeholder?: string;
    hint?: string;
    optional?: boolean;
    mono?: boolean;
    multiline?: boolean;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength?: number;
}

/** A Field bound to one bank form value, with its error and blur tracking. */
export const BankField = memo<BankFieldProps>(
    ({
        name,
        label,
        display,
        form,
        setForm,
        clean,
        errors,
        onTouch,
        placeholder,
        hint,
        optional,
        mono,
        multiline,
        inputMode,
        maxLength
    }) => {
        const handleChange = useCallback(
            (value: string) => setForm({ [name]: clean ? clean(value) : value }),
            [setForm, name, clean]
        );
        const handleBlur = useCallback(() => onTouch?.(name as BankErrorKey), [onTouch, name]);
        return (
            <Field
                label={label}
                value={display ?? form[name]}
                onValueChange={handleChange}
                onBlur={handleBlur}
                type={multiline ? "textarea" : "text"}
                placeholder={placeholder}
                hint={hint}
                error={errors?.[name as BankErrorKey]}
                optional={optional}
                mono={mono}
                inputMode={inputMode}
                maxLength={maxLength}
            />
        );
    }
);

BankField.displayName = "BankField";

export default BankField;
