import { Activity, memo, useCallback, useId, useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent, HTMLAttributes, Ref } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import "./Field.css";

export type FieldType = "text" | "password" | "email" | "tel" | "url" | "textarea";

export interface FieldProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: FieldType;
    id?: string;
    name?: string;
    placeholder?: string;
    hint?: string;
    /** Shown instead of the hint, with an icon, and marks the input invalid. */
    error?: string;
    optional?: boolean;
    required?: boolean;
    /** Keeps the label for screen readers but hides it visually. */
    hideLabel?: boolean;
    /** Tabular, slightly heavier text for numbers like IBANs. */
    mono?: boolean;
    inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength?: number;
    autoComplete?: string;
    disabled?: boolean;
    rows?: number;
    /** Ref to the single-line input (not used for textarea). */
    ref?: Ref<HTMLInputElement>;
}

export const Field = memo<FieldProps>(
    ({
        label,
        value,
        onValueChange,
        onBlur,
        type = "text",
        id,
        name,
        placeholder,
        hint,
        error,
        optional = false,
        required = false,
        hideLabel = false,
        mono = false,
        inputMode,
        maxLength,
        autoComplete = "off",
        disabled = false,
        rows = 3,
        ref
    }) => {
        const autoId = useId();
        const inputId = id ?? autoId;
        const hintId = `${inputId}-hint`;
        const errorId = `${inputId}-error`;
        const hasError = Boolean(error);
        const hasHint = !hasError && Boolean(hint);
        const isTextarea = type === "textarea";
        const isPassword = type === "password";
        const [revealed, setRevealed] = useState(false);

        const describedBy = useMemo(() => {
            if (hasError) return errorId;
            if (hasHint) return hintId;
            return undefined;
        }, [hasError, hasHint, errorId, hintId]);

        const inputType = useMemo(() => {
            if (isPassword) return revealed ? "text" : "password";
            return isTextarea ? "text" : type;
        }, [isPassword, isTextarea, revealed, type]);

        const controlClass = useMemo(
            () =>
                classNames(
                    "field__control",
                    isTextarea && "field__control--textarea",
                    mono && "field__control--mono",
                    isPassword && "field__control--password",
                    hasError && "field__control--invalid"
                ),
            [isTextarea, mono, isPassword, hasError]
        );

        const labelClass = useMemo(() => classNames("field__label", hideLabel && "sr-only"), [hideLabel]);

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onValueChange(event.target.value),
            [onValueChange]
        );
        const toggleReveal = useCallback(() => setRevealed(current => !current), []);

        return (
            <div className="field">
                <label htmlFor={inputId} className={labelClass}>
                    {label}
                    <Activity mode={optional && !hideLabel ? "visible" : "hidden"}>
                        <span className="field__tag">Optional</span>
                    </Activity>
                    <Activity mode={required && !hideLabel ? "visible" : "hidden"}>
                        <span className="field__tag">Required</span>
                    </Activity>
                </label>
                <Activity mode={isTextarea ? "visible" : "hidden"}>
                    <textarea
                        id={isTextarea ? inputId : undefined}
                        name={isTextarea ? name : undefined}
                        className={controlClass}
                        rows={rows}
                        value={value}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        disabled={disabled}
                        required={isTextarea && required}
                        aria-invalid={hasError}
                        aria-describedby={describedBy}
                        onChange={handleChange}
                        onBlur={onBlur}
                    />
                </Activity>
                <Activity mode={isTextarea ? "hidden" : "visible"}>
                    <div className="field__input-wrap">
                        <input
                            ref={isTextarea ? undefined : ref}
                            id={isTextarea ? undefined : inputId}
                            name={isTextarea ? undefined : name}
                            className={controlClass}
                            type={inputType}
                            value={value}
                            placeholder={placeholder}
                            inputMode={inputMode}
                            maxLength={maxLength}
                            autoComplete={autoComplete}
                            spellCheck={false}
                            disabled={disabled}
                            required={!isTextarea && required}
                            aria-invalid={hasError}
                            aria-describedby={describedBy}
                            onChange={handleChange}
                            onBlur={onBlur}
                        />
                        <Activity mode={isPassword ? "visible" : "hidden"}>
                            <button
                                type="button"
                                className="field__reveal hit-area"
                                onClick={toggleReveal}
                                aria-label={revealed ? "Hide password" : "Show password"}
                                aria-pressed={revealed}
                                aria-controls={inputId}
                                disabled={disabled}
                            >
                                <Activity mode={revealed ? "visible" : "hidden"}>
                                    <EyeOff size={16} aria-hidden="true" />
                                </Activity>
                                <Activity mode={revealed ? "hidden" : "visible"}>
                                    <Eye size={16} aria-hidden="true" />
                                </Activity>
                            </button>
                        </Activity>
                    </div>
                </Activity>
                <Activity mode={hasError ? "visible" : "hidden"}>
                    <div id={errorId} className="field__error" role="alert">
                        <CircleAlert size={14} aria-hidden="true" className="field__error-icon" />
                        <span>{error}</span>
                    </div>
                </Activity>
                <Activity mode={hasHint ? "visible" : "hidden"}>
                    <div id={hintId} className="field__hint">
                        {hint}
                    </div>
                </Activity>
            </div>
        );
    }
);

Field.displayName = "Field";

export default Field;
