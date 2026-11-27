import { Activity, memo, useCallback, useId, useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import { CircleAlert, Upload, X } from "lucide-react";
import { classNames } from "../../../lib/classNames";
import "./ImageUpload.css";

export interface ImageUploadValue {
    /** Object URL or data URL of the image. It never leaves the browser. */
    url: string;
    name: string;
}

export interface ImageUploadProps {
    label: string;
    value: ImageUploadValue | null;
    onSelect: (file: File) => void;
    onRemove: () => void;
    /** Empty-state title, e.g. "Upload a custom logo". */
    prompt: string;
    /** Empty-state help, e.g. accepted formats and size. */
    hint?: string;
    /** Shown under the file name once an image is chosen. */
    description?: string;
    accept?: string;
    error?: string;
    /** "square" (logo) or "circle" (profile photo) preview. */
    shape?: "square" | "circle";
}

export const ImageUpload = memo<ImageUploadProps>(
    ({
        label,
        value,
        onSelect,
        onRemove,
        prompt,
        hint,
        description,
        accept = "image/png,image/jpeg,image/svg+xml,image/webp",
        error,
        shape = "square"
    }) => {
        const inputId = useId();
        const errorId = useId();
        const inputRef = useRef<HTMLInputElement>(null);
        const hasImage = value !== null;
        const hasError = Boolean(error);
        const previewClass = useMemo(
            () => classNames("image-upload__preview", shape === "circle" && "image-upload__preview--circle"),
            [shape]
        );

        const handleChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                // Reset so choosing the same file again still fires a change.
                event.target.value = "";
                if (file) onSelect(file);
            },
            [onSelect]
        );

        const handleRemove = useCallback(() => {
            onRemove();
            inputRef.current?.focus();
        }, [onRemove]);

        return (
            <div className="image-upload">
                <div className="image-upload__label">{label}</div>
                <Activity mode={hasImage ? "visible" : "hidden"}>
                    <div className="image-upload__row">
                        <img src={value?.url || undefined} alt={`${label} preview`} className={previewClass} />
                        <div className="image-upload__meta">
                            <div className="image-upload__name">{value?.name}</div>
                            <div className="image-upload__description">{description}</div>
                        </div>
                        <label htmlFor={inputId} className="image-upload__replace">
                            Replace
                        </label>
                        <button
                            type="button"
                            className="image-upload__remove"
                            onClick={handleRemove}
                            aria-label={`Remove ${label.toLowerCase()}`}
                        >
                            <X size={16} aria-hidden="true" />
                        </button>
                    </div>
                </Activity>
                <Activity mode={hasImage ? "hidden" : "visible"}>
                    <label htmlFor={inputId} className="image-upload__drop">
                        <span className="image-upload__drop-icon" aria-hidden="true">
                            <Upload size={16} />
                        </span>
                        <span className="image-upload__drop-text">
                            <span className="image-upload__prompt">{prompt}</span>
                            <span className="image-upload__hint">{hint}</span>
                        </span>
                    </label>
                </Activity>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    className="image-upload__input"
                    aria-label={hasImage ? `Replace ${label.toLowerCase()}` : prompt}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    onChange={handleChange}
                />
                <Activity mode={hasError ? "visible" : "hidden"}>
                    <div id={errorId} className="image-upload__error" role="alert">
                        <CircleAlert size={14} aria-hidden="true" />
                        <span>{error}</span>
                    </div>
                </Activity>
            </div>
        );
    }
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
